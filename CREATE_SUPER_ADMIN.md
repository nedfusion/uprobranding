# Create Super Admin Account

## Your Super Admin Credentials

**Email**: superadmin@upro.com (or your preferred domain)
**Password**: UPRObrand@@

---

## Step-by-Step Instructions

### Step 1: Register the Account (On Your Live Website)

1. Go to your website: `https://yourdomain.com/auth/register`
2. Fill in the registration form:
   - **Email**: `superadmin@upro.com` (or use your domain)
   - **Password**: `UPRObrand@@`
   - **First Name**: Super
   - **Last Name**: Admin
   - **Phone**: +2348000000000 (or your number)
   - **User Type**: Select "Customer" (we'll upgrade it next)
   - **State**: Select your state
   - **LGA**: Enter your LGA
   - **Address**: (optional)
3. Click "Register"

---

### Step 2: Upgrade to Super Admin (In Supabase Dashboard)

**Option A: Using SQL Editor (Recommended)**

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your UPRO project
3. Click "SQL Editor" in the left sidebar
4. Copy and paste this query:

```sql
-- Upgrade superadmin@upro.com to Super Admin
UPDATE users_profile
SET user_type = 'super_admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'superadmin@upro.com'
);

-- Verify the change
SELECT
  up.id,
  au.email,
  up.first_name,
  up.last_name,
  up.user_type,
  up.is_active,
  up.is_verified
FROM users_profile up
JOIN auth.users au ON au.id = up.id
WHERE au.email = 'superadmin@upro.com';
```

5. Click "Run" or press Ctrl+Enter
6. You should see "Success. 1 rows affected."
7. The second query will show you the user details to confirm

**Option B: Using Table Editor**

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your UPRO project
3. Click "Table Editor" in the left sidebar
4. Select the `users_profile` table
5. Find the row with your email (superadmin@upro.com)
6. Click on the row to edit it
7. Change `user_type` from `customer` to `super_admin`
8. Click "Save"

---

### Step 3: Verify Super Admin Access

1. Go back to your website
2. **Log out** if you're currently logged in
3. Go to `https://yourdomain.com/auth/login`
4. Log in with:
   - Email: `superadmin@upro.com`
   - Password: `UPRObrand@@`
5. You should be redirected to `/admin/dashboard`
6. You should now see full admin controls

---

## What You Can Do as Super Admin

Once logged in, you can:

### User Management
- Navigate to "Manage Users" from the admin dashboard
- Create new users (customers, service providers, admins)
- Edit user information
- Activate/deactivate accounts
- Verify users
- Delete users
- Search and filter users

### Admin Management
- Create additional admin accounts for your team
- Create other super admin accounts if needed
- View all admin activity logs

### Platform Management
- Access all admin features
- View statistics and analytics
- Manage customer support
- Monitor system activity

---

## Important Security Notes

1. **Change Email**: If you're deploying to production, use a professional email address like:
   - `admin@yourdomain.com`
   - `superadmin@yourdomain.com`
   - Your personal business email

2. **Keep Credentials Secure**:
   - Don't share super admin credentials
   - Store password in a password manager
   - Consider changing the password after first login

3. **Create Regular Admins**:
   - Don't use super admin for daily operations
   - Create regular admin accounts for your team
   - Reserve super admin for critical tasks only

---

## Troubleshooting

### Can't Find User in Database
- Make sure you completed Step 1 (registration on website)
- Check you're looking in the right Supabase project
- Verify the email address is exactly as you registered

### Login Not Working After Upgrade
- Clear browser cache and cookies
- Log out completely and log back in
- Try incognito/private browsing mode
- Check browser console for errors (F12)

### Don't See Admin Features
- Verify the SQL query executed successfully
- Confirm `user_type` is set to `super_admin` in the database
- Make sure you're logged in with the correct account
- Try logging out and back in

---

## Quick Reference SQL Queries

### Check Current User Type
```sql
SELECT
  au.email,
  up.user_type,
  up.first_name,
  up.last_name,
  up.is_active
FROM auth.users au
JOIN users_profile up ON up.id = au.id
WHERE au.email = 'superadmin@upro.com';
```

### Change User Type
```sql
UPDATE users_profile
SET user_type = 'super_admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'superadmin@upro.com'
);
```

### Verify and Activate User
```sql
UPDATE users_profile
SET
  is_verified = true,
  is_active = true
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'superadmin@upro.com'
);
```

### List All Admin Users
```sql
SELECT
  au.email,
  up.first_name,
  up.last_name,
  up.user_type,
  up.is_active,
  up.created_at
FROM users_profile up
JOIN auth.users au ON au.id = up.id
WHERE up.user_type IN ('admin', 'super_admin')
ORDER BY up.created_at DESC;
```

---

## Next Steps After Login

1. **Create Additional Admins**
   - Go to Admin Dashboard → Manage Users
   - Click "Create User"
   - Select user type as "Admin"
   - Fill in their details

2. **Verify Service Providers**
   - Review service provider registrations
   - Verify legitimate providers
   - Deactivate suspicious accounts

3. **Configure Platform Settings**
   - Review all admin features
   - Familiarize yourself with the admin panel
   - Set up your team's admin accounts

4. **Start Onboarding Users**
   - Manually create initial service providers
   - Set up test accounts for each user type
   - Test the full user flow

---

## Alternative Email Addresses

If you want to use a different email address, replace `superadmin@upro.com` with:

- `admin@yourdomain.com`
- `info@yourdomain.com`
- Your personal email
- Any professional email you have access to

Just make sure to:
1. Use the same email when registering on the website
2. Use the same email in the SQL queries
3. Have access to that email for future password resets

---

**Your Super Admin Credentials**:
- Email: `superadmin@upro.com` (modify as needed)
- Password: `UPRObrand@@`
- User Type: Super Admin (after SQL upgrade)
- Full Platform Access: Yes

**Remember**: You must complete both Step 1 (registration) and Step 2 (SQL upgrade) for the super admin to work!

---

Last Updated: 2026-02-16
Status: Ready to Create
