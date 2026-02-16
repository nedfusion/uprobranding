# UPRO Platform - Super Admin Setup Guide

## Initial Super Admin Creation

Your UPRO platform is now configured with a production-ready database and admin management system. Follow these steps to create your first super admin account and start managing the platform.

### Step 1: Register Your Admin Account

1. Navigate to your deployed website: `https://your-domain.com`
2. Click on "Register" or go to `/auth/register`
3. Fill out the registration form with your admin details:
   - **Email**: Use a secure email address (e.g., `admin@upro.com`)
   - **Password**: Create a strong password (minimum 8 characters, include numbers and special characters)
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Phone**: Your contact number
   - **User Type**: Select "Customer" (we'll upgrade this to super_admin in the next step)
   - **State & LGA**: Your location details
4. Complete the registration

### Step 2: Upgrade to Super Admin

After registration, you need to manually upgrade this account to super_admin status in the database.

#### Option A: Using Supabase Dashboard

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your UPRO project
3. Click on "Table Editor" in the left sidebar
4. Select the `users_profile` table
5. Find your newly created account (search by email)
6. Click on the row to edit
7. Change the `user_type` field from `customer` to `super_admin`
8. Click "Save"

#### Option B: Using SQL Query

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your UPRO project
3. Click on "SQL Editor" in the left sidebar
4. Run this query (replace with your actual email):

```sql
UPDATE users_profile
SET user_type = 'super_admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@upro.com'
);
```

5. Execute the query

### Step 3: Log In as Super Admin

1. Log out if you're currently logged in
2. Go to `/auth/login`
3. Log in with your super admin credentials
4. You'll be redirected to the Admin Dashboard with full super admin privileges

---

## Super Admin Capabilities

As a super admin, you have complete control over the platform:

### User Management
- **Create Users**: Create customers, service providers, admins, and other super admins
- **Edit Users**: Modify user information, change user types
- **Delete Users**: Remove users from the platform (permanent action)
- **Verify Users**: Mark accounts as verified
- **Activate/Deactivate**: Enable or disable user accounts

### Admin Management
- **Create Admins**: Add regular admin accounts to help manage the platform
- **Assign Permissions**: Control what each admin can do
- **Monitor Activity**: View all admin actions through the admin logs

### Platform Management
- **View Statistics**: Access all platform metrics and analytics
- **Manage Bookings**: View, edit, and resolve all bookings
- **Handle Disputes**: Resolve conflicts between users
- **Financial Oversight**: Monitor transactions and wallet activities
- **Customer Support**: Access and manage all support conversations

---

## Creating Additional Admins

### Method 1: Through the Admin Panel (Recommended)

1. Log in as super admin
2. Navigate to "Users Management" (Admin Dashboard → Manage Users)
3. Click "Create User"
4. Fill in the admin details:
   - Email and Password
   - Personal Information
   - **User Type**: Select "Admin" or "Super Admin"
   - Location details
5. Click "Create User"
6. The new admin can now log in with these credentials

### Method 2: Have Them Register and Upgrade

1. Have the person register a normal account
2. As super admin, go to "Users Management"
3. Find their account in the list
4. Click "Edit"
5. Change their "User Type" to "Admin" or "Super Admin"
6. Save changes

---

## Default Super Admin Credentials (For Development)

For development/testing purposes, you can create a default super admin account:

**Email**: `superadmin@upro.com`
**Password**: `SecureP@ss2024!`

**IMPORTANT**: Change these credentials immediately after first login in production!

To create this default admin, run this SQL in Supabase:

```sql
-- This will be handled by your registration + upgrade process
-- Use the steps above to create your super admin
```

---

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- Include uppercase and lowercase letters
- Include at least one number
- Include at least one special character
- Avoid common words or patterns

### Account Security
- **Never share super admin credentials**
- Use strong, unique passwords
- Change passwords regularly (every 90 days recommended)
- Enable two-factor authentication when available
- Log out from shared computers

### Admin Account Management
- **Principle of Least Privilege**: Only grant super admin access to those who absolutely need it
- Create regular "admin" accounts for day-to-day operations
- Regularly audit admin accounts and remove inactive ones
- Monitor the admin logs for suspicious activity

---

## Admin Types and Permissions

### Super Admin
- Full access to everything
- Can create/edit/delete all users including admins
- Can modify system settings
- Can view all financial data
- Can delete records

### Admin
- Can view and manage users (except super admins)
- Can manage bookings and disputes
- Can handle customer support
- Can view analytics
- **Cannot** delete users
- **Cannot** create other admins
- **Cannot** modify super admins

### Regular Users
- **Customer**: Can book services, rate providers, use wallet
- **Service Provider**: Can offer services, accept bookings, receive payments

---

## Troubleshooting

### Can't Access Admin Panel
- Verify your user_type is set to 'super_admin' or 'admin' in the database
- Clear your browser cache and cookies
- Log out completely and log back in
- Check the browser console for errors

### Admin Functions Not Working
- Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)
- Check your internet connection
- Verify Supabase credentials in `.env` file
- Check Supabase dashboard for any service issues

### Database Connection Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Ensure your Supabase project is active
- Check if your IP is whitelisted (if IP restrictions are enabled)
- Verify Row Level Security policies are properly configured

---

## Important Notes

1. **Super Admin Responsibility**: Super admins have complete control over the platform. Be extremely careful when:
   - Deleting users or data
   - Modifying financial records
   - Changing user types
   - Accessing sensitive information

2. **Data Privacy**: Always comply with data protection regulations (GDPR, etc.) when handling user data

3. **Audit Logs**: All admin actions are logged in the `admin_logs` table for accountability

4. **Backup Strategy**: Regularly backup your database through Supabase

5. **Testing**: Test any major changes in a development environment first

---

## Support and Maintenance

### Regular Tasks
- **Daily**: Monitor customer support tickets and disputes
- **Weekly**: Review user registrations and verify service providers
- **Monthly**: Analyze platform metrics and financial reports
- **Quarterly**: Audit admin accounts and review security logs

### Emergency Procedures
- If super admin account is compromised, immediately:
  1. Reset password through Supabase dashboard
  2. Check admin logs for unauthorized actions
  3. Review all user accounts for suspicious changes
  4. Notify all admins

---

## Contact Information

For technical support or questions about the admin system:
- Email: support@upro.com
- Documentation: [Your documentation URL]

---

**Last Updated**: 2026-02-02
**Version**: 1.0.0 - Production Ready
