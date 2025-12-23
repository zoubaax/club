-- Add score column to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS score NUMERIC(5, 2);

-- Add comment to explain the score field
COMMENT ON COLUMN teams.score IS 'Team score (numeric value, can be null)';

