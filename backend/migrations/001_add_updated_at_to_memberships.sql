-- Add updated_at column to memberships table
ALTER TABLE memberships 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to set updated_at equal to created_at
UPDATE memberships 
SET updated_at = created_at 
WHERE updated_at IS NULL; 