-- This migration ensures storage policies are set up correctly
-- Note: Storage policies must be created manually in Supabase Dashboard
-- This file documents the required policies

-- Storage policies for team-logos bucket should be:
-- 
-- 1. Public SELECT (read access)
--    Policy name: "Public read access"
--    Operation: SELECT
--    Target roles: public
--    Policy: (bucket_id = 'team-logos')
--
-- 2. Admin INSERT (upload)
--    Policy name: "Admin upload access"  
--    Operation: INSERT
--    Target roles: authenticated
--    Policy: (bucket_id = 'team-logos' AND EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()))
--
-- 3. Admin UPDATE
--    Policy name: "Admin update access"
--    Operation: UPDATE
--    Target roles: authenticated
--    Policy: (bucket_id = 'team-logos' AND EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()))
--
-- 4. Admin DELETE
--    Policy name: "Admin delete access"
--    Operation: DELETE
--    Target roles: authenticated
--    Policy: (bucket_id = 'team-logos' AND EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()))

-- Verify the is_admin function exists and works correctly
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

-- Ensure teams table policies allow logo_url updates
-- The existing policies should already cover this, but let's verify
-- No changes needed - existing policies allow all column updates for admins

