-- Fix numeric field overflow for teams.score
-- Increase precision from NUMERIC(5, 2) to NUMERIC(10, 2)
-- This allows scores up to 99,999,999.99

-- Drop the existing column constraint and recreate with larger precision
ALTER TABLE teams 
  ALTER COLUMN score TYPE NUMERIC(10, 2);

-- Update comment
COMMENT ON COLUMN teams.score IS 'Team score (numeric value up to 99,999,999.99, can be null)';

