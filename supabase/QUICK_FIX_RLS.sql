-- Quick Fix for RLS "new row violates row-level security policy" Error
-- Run this in Supabase SQL Editor to diagnose and fix common issues

-- Step 1: Check if you're authenticated (should return your user ID)
SELECT 
  'Current User ID' as check_type,
  auth.uid() as result,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ NOT AUTHENTICATED - Log in first!'
    ELSE '✅ Authenticated'
  END as status;

-- Step 2: Check if you exist in admins table
SELECT 
  'Admin Status' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()) THEN '✅ You are an admin'
    ELSE '❌ You are NOT in admins table'
  END as status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()) THEN '✅ Already in admins table - RLS error is likely from Storage policies'
    ELSE 'Run the INSERT statement below to add yourself'
  END as action_needed;

-- Step 3: Test the is_admin function
SELECT 
  'is_admin() Function' as check_type,
  is_admin(auth.uid()) as result,
  CASE 
    WHEN is_admin(auth.uid()) THEN '✅ Function works correctly'
    WHEN auth.uid() IS NULL THEN '⚠️ Not authenticated'
    ELSE '❌ Function returns false - check admins table'
  END as status;

-- Step 4: Show your admin record (if exists)
SELECT 
  'Your Admin Record' as check_type,
  id,
  email,
  name,
  created_at
FROM admins 
WHERE id = auth.uid();

-- ============================================
-- FIX: If you're not in admins table, run this:
-- ============================================
-- Replace 'your-email@example.com' and 'Your Name' with your actual values
-- First, get your user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then uncomment and run this (replace the UUID and values):
-- NOTE: Use ON CONFLICT to avoid duplicate key errors if already exists
/*
INSERT INTO admins (id, email, name)
VALUES (
  'your-user-id-from-above',
  'your-email@example.com',
  'Your Name'
)
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name;
*/

-- ============================================
-- IMPORTANT: If you got "duplicate key" error, you're already an admin!
-- The RLS error is likely from STORAGE policies, not database policies.
-- ============================================
-- Next steps:
-- 1. Go to Storage → Create bucket named "team-logos" (if not exists)
-- 2. Set bucket to PUBLIC
-- 3. Go to Storage → Policies → team-logos bucket
-- 4. Create the 4 policies as described in STORAGE_SETUP.md

-- ============================================
-- FIX: Recreate is_admin function if needed
-- ============================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Verify RLS policies exist
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'teams'
ORDER BY policyname;

-- Should show 4 policies:
-- 1. Teams: Public SELECT
-- 2. Teams: Admin INSERT
-- 3. Teams: Admin UPDATE
-- 4. Teams: Admin DELETE

