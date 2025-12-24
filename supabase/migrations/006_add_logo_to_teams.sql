-- Add logo_url column to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment to explain the logo_url field
COMMENT ON COLUMN teams.logo_url IS 'URL to team logo image stored in Supabase Storage';

