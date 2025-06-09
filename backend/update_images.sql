-- Update jet category images
UPDATE jet_categories 
SET image_url = CASE name
    WHEN 'Light Jet' THEN 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'
    WHEN 'Midsize Jet' THEN 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60'
    WHEN 'Super Midsize Jet' THEN 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60'
    WHEN 'Large Jet' THEN 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'
END;

-- Update jet images and galleries
UPDATE jets 
SET 
    image_url = CASE name
        WHEN 'Cessna Citation CJ4' THEN 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'
        WHEN 'Gulfstream G280' THEN 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60'
        WHEN 'Bombardier Challenger 350' THEN 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60'
    END,
    gallery_urls = CASE name
        WHEN 'Cessna Citation CJ4' THEN ARRAY[
            'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60'
        ]
        WHEN 'Gulfstream G280' THEN ARRAY[
            'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60'
        ]
        WHEN 'Bombardier Challenger 350' THEN ARRAY[
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'
        ]
    END; 