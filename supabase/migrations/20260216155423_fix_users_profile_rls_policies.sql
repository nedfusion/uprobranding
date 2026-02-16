/*
  # Fix Infinite Recursion in users_profile RLS Policies

  ## Problem
  The existing RLS policies for users_profile table create infinite recursion by
  querying users_profile within the policies themselves.

  ## Solution
  1. Drop all existing problematic policies
  2. Create a security definer function to safely check user types
  3. Create new policies that use this function to avoid recursion

  ## Changes
  - Drop existing policies that cause recursion
  - Create `get_user_type()` function that bypasses RLS
  - Create new, simpler policies that work correctly
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON users_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profile;
DROP POLICY IF EXISTS "Super admins can update any profile" ON users_profile;
DROP POLICY IF EXISTS "Admins can delete profiles" ON users_profile;

-- Create a helper function to get user type safely (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_type(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT user_type FROM users_profile WHERE id = user_id;
$$;

-- Recreate policies without recursion

-- Users can update their own profile, but NOT their user_type
CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    user_type = COALESCE(get_user_type(auth.uid()), 'customer')
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON users_profile FOR SELECT
  TO authenticated
  USING (
    get_user_type(auth.uid()) IN ('admin', 'super_admin')
  );

-- Super admins can update any profile (including user_type changes)
CREATE POLICY "Super admins can update any profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (
    get_user_type(auth.uid()) = 'super_admin'
  )
  WITH CHECK (
    get_user_type(auth.uid()) = 'super_admin'
  );

-- Super admins can delete profiles
CREATE POLICY "Super admins can delete profiles"
  ON users_profile FOR DELETE
  TO authenticated
  USING (
    get_user_type(auth.uid()) = 'super_admin'
  );
