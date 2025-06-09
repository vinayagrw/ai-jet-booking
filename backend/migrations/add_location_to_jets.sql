-- Add location column to jets table
ALTER TABLE jets ADD COLUMN location VARCHAR(255);

-- Update existing jets with default location
UPDATE jets SET location = 'New York' WHERE location IS NULL; 