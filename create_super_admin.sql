-- ============================================
-- UPRO Platform - Create Super Admin Account
-- ============================================
--
-- INSTRUCTIONS:
-- 1. First, register an account on your website with email: superadmin@upro.com
-- 2. Then run this SQL query in Supabase SQL Editor
-- 3. Log out and log back in to see admin features
--
-- ============================================

-- Upgrade the user to Super Admin
UPDATE users_profile
SET
  user_type = 'super_admin',
  is_verified = true,
  is_active = true
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'superadmin@upro.com'
);

-- Verify the upgrade was successful
SELECT
  au.email,
  up.first_name || ' ' || up.last_name as full_name,
  up.user_type,
  up.is_verified,
  up.is_active,
  up.created_at
FROM users_profile up
JOIN auth.users au ON au.id = up.id
WHERE au.email = 'superadmin@upro.com';

-- Expected result:
-- email: superadmin@upro.com
-- full_name: Super Admin
-- user_type: super_admin
-- is_verified: true
-- is_active: true
