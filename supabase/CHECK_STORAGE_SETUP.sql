-- Check Storage Bucket and Policies Setup
-- Run this AFTER confirming you're an admin (from QUICK_FIX_RLS.sql)

-- Note: Storage buckets and policies cannot be checked via SQL
-- You must check them in the Supabase Dashboard

-- ============================================
-- MANUAL CHECKLIST (Do this in Supabase Dashboard):
-- ============================================

-- ✅ Step 1: Verify Storage Bucket Exists
-- Go to: Storage → Buckets
-- Look for bucket named: "team-logos"
-- If missing, create it:
--   - Name: team-logos
--   - Public: YES (check this!)
--   - File size limit: 5 MB
--   - Allowed MIME types: image/*

-- ✅ Step 2: Verify Storage Policies Exist
-- Go to: Storage → Policies → Select "team-logos" bucket
-- You should see 4 policies:

-- Policy 1: Public read access
--   - Operation: SELECT
--   - Target: public
--   - Policy: (bucket_id = 'team-logos')

-- Policy 2: Admin upload access
--   - Operation: INSERT
--   - Target: authenticated
--   - Policy: bucket_id = 'team-logos' AND EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid())

-- Policy 3: Admin update access
--   - Operation: UPDATE
--   - Target: authenticated
--   - Policy: bucket_id = 'team-logos' AND EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid())

-- Policy 4: Admin delete access
--   - Operation: DELETE
--   - Target: authenticated
--   - Policy: bucket_id = 'team-logos' AND EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid())

-- ============================================
-- QUICK FIX: Create Storage Policies via SQL
-- ============================================
-- Note: Storage policies must be created in Dashboard, but here's the SQL format
-- for reference when creating them manually:

-- Policy 1 (Public Read):
-- Name: "Public read access"
-- Operation: SELECT
-- Target roles: public
-- Policy definition:
(bucket_id = 'team-logos')

-- Policy 2 (Admin Upload):
-- Name: "Admin upload access"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)

-- Policy 3 (Admin Update):
-- Name: "Admin update access"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)

-- Policy 4 (Admin Delete):
-- Name: "Admin delete access"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)

-- ============================================
-- TEST: Verify Database Access (should work)
-- ============================================
-- If you're an admin, these should all work:

-- Test 1: Select teams (public access)
SELECT COUNT(*) as team_count FROM teams;

-- Test 2: Insert team (admin only)
-- Uncomment to test:
/*
INSERT INTO teams (name, description)
VALUES ('Test Team', 'Test Description')
RETURNING id, name;
*/

-- Test 3: Update team (admin only)
-- Uncomment to test (replace with actual team ID):
/*
UPDATE teams 
SET description = 'Updated description'
WHERE id = 'some-team-id'
RETURNING id, name, description;
*/

-- ============================================
-- SUMMARY
-- ============================================
-- If you got "duplicate key" error for admins table:
-- ✅ You ARE an admin (good!)
-- ❌ The RLS error is from STORAGE, not database
-- 
-- Solution: Set up Storage bucket and policies in Dashboard
-- See STORAGE_SETUP.md for detailed instructions

