-- First, create a temporary table with unique categories
CREATE TEMP TABLE temp_categories AS
SELECT DISTINCT ON (name) *
FROM jet_categories
ORDER BY name, created_at DESC;

-- Delete all categories
DELETE FROM jet_categories;

-- Insert back only unique categories
INSERT INTO jet_categories
SELECT * FROM temp_categories;

-- Drop the temporary table
DROP TABLE temp_categories; 