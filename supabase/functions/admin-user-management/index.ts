import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller is authenticated and is an admin/super_admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use anon client to verify the calling user's session
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: callerUser }, error: authError } = await callerClient.auth.getUser();
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check the caller is admin or super_admin
    const { data: callerProfile, error: profileError } = await callerClient
      .from("users_profile")
      .select("user_type")
      .eq("id", callerUser.id)
      .single();

    if (profileError || !callerProfile || !["admin", "super_admin"].includes(callerProfile.user_type)) {
      return new Response(JSON.stringify({ error: "You are not allowed to perform this action" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for privileged operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { action, ...payload } = await req.json();

    if (action === "create_user") {
      const { email, password, first_name, last_name, phone, user_type, state, lga, address } = payload;

      // Only super_admin can create admin/super_admin accounts
      if (["admin", "super_admin"].includes(user_type) && callerProfile.user_type !== "super_admin") {
        return new Response(JSON.stringify({ error: "Only super admins can create admin accounts" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) throw createError;
      if (!authData.user) throw new Error("Failed to create auth user");

      const { error: profileInsertError } = await adminClient
        .from("users_profile")
        .insert({
          id: authData.user.id,
          first_name,
          last_name,
          phone,
          user_type,
          state,
          lga,
          address,
          is_verified: true,
          is_active: true,
        });

      if (profileInsertError) {
        // Rollback auth user if profile creation fails
        await adminClient.auth.admin.deleteUser(authData.user.id);
        throw profileInsertError;
      }

      if (user_type === "service_provider") {
        await adminClient.from("service_providers").insert({
          user_id: authData.user.id,
          bio: "",
          service_categories: [],
          experience_years: 0,
        });
      }

      // Log the action
      await adminClient.from("admin_logs").insert({
        admin_id: callerUser.id,
        action: "create_user",
        target_type: "user",
        target_id: authData.user.id,
      });

      return new Response(JSON.stringify({ success: true, userId: authData.user.id }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_user") {
      const { userId } = payload;

      if (callerProfile.user_type !== "super_admin") {
        return new Response(JSON.stringify({ error: "Only super admins can delete users" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent deleting yourself
      if (userId === callerUser.id) {
        return new Response(JSON.stringify({ error: "You cannot delete your own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;

      await adminClient.from("admin_logs").insert({
        admin_id: callerUser.id,
        action: "delete_user",
        target_type: "user",
        target_id: userId,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_user_emails") {
      const { userIds } = payload;

      const emailMap: Record<string, string> = {};
      for (const id of userIds) {
        const { data } = await adminClient.auth.admin.getUserById(id);
        if (data?.user?.email) {
          emailMap[id] = data.user.email;
        }
      }

      return new Response(JSON.stringify({ emailMap }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
