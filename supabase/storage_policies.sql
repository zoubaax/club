-- ============================================
-- SUPABASE STORAGE POLICIES FOR TEAM LOGOS
-- ============================================
-- 
-- IMPORTANT: Storage policies must be created in the Supabase Dashboard
-- Go to: Storage → Policies → Select "team-logos" bucket → New Policy
-- 
-- Copy the policy definitions below when creating each policy in the dashboard.
-- ============================================

-- ============================================
-- POLICY 1: Public Read Access
-- ============================================
-- Policy Name: "Public read access"
-- Allowed Operation: SELECT
-- Target Roles: public
-- 
-- Policy Definition (copy this):
(bucket_id = 'team-logos')

-- ============================================
-- POLICY 2: Admin Upload Access
-- ============================================
-- Policy Name: "Admin upload access"
-- Allowed Operation: INSERT
-- Target Roles: authenticated
-- 
-- Policy Definition (copy this):
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)

-- ============================================
-- POLICY 3: Admin Update Access
-- ============================================
-- Policy Name: "Admin update access"
-- Allowed Operation: UPDATE
-- Target Roles: authenticated
-- 
-- Policy Definition (copy this):
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)

-- ============================================
-- POLICY 4: Admin Delete Access
-- ============================================
-- Policy Name: "Admin delete access"
-- Allowed Operation: DELETE
-- Target Roles: authenticated
-- 
-- Policy Definition (copy this):
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)

-- ============================================
-- ALTERNATIVE: Using Supabase Management API
-- ============================================
-- If you want to create policies programmatically, you can use the Supabase Management API
-- or the Supabase CLI. However, the easiest way is through the Dashboard UI.
--
-- For reference, here's the structure each policy should have:
--
-- {
--   "name": "Policy Name",
--   "bucket_id": "team-logos",
--   "operation": "SELECT|INSERT|UPDATE|DELETE",
--   "definition": "SQL policy definition",
--   "check": "SQL check definition (for INSERT/UPDATE)",
--   "target_roles": ["public" or "authenticated"]
-- }
--
-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After creating policies, you can verify they exist by checking:
-- Dashboard → Storage → Policies → team-logos bucket
-- 
-- You should see 4 policies listed.

