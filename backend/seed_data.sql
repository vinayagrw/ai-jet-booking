-- Clear existing categories
DELETE FROM jet_categories;

-- Insert sample data with unique categories
INSERT INTO jet_categories (name, description, image_url) VALUES
    ('Light Jet', 'Small, efficient jets perfect for short to medium-range flights', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60'),
    ('Midsize Jet', 'Versatile jets offering a balance of range and comfort', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60'),
    ('Super Midsize Jet', 'Larger jets with extended range and enhanced amenities', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'),
    ('Large Jet', 'Premium jets offering maximum comfort and range', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60');

INSERT INTO memberships (name, description, price, duration_months, benefits, image_url) VALUES
    ('Basic', 'Essential benefits for occasional travelers', 999.00, 12, ARRAY['Priority booking', '5% discount on flights', 'Basic concierge service'], 'https://api.dicebear.com/7.x/shapes/svg?seed=Basic&backgroundColor=b6e3f4'),
    ('Premium', 'Enhanced benefits for frequent travelers', 1999.00, 12, ARRAY['Priority booking', '10% discount on flights', 'Premium concierge service', 'Complimentary ground transportation'], 'https://api.dicebear.com/7.x/shapes/svg?seed=Premium&backgroundColor=b6e3f4'),
    ('Elite', 'Ultimate benefits for VIP travelers', 3999.00, 12, ARRAY['Priority booking', '15% discount on flights', 'Elite concierge service', 'Complimentary ground transportation', 'Access to exclusive events'], 'https://api.dicebear.com/7.x/shapes/svg?seed=Elite&backgroundColor=b6e3f4');

INSERT INTO jets (name, manufacturer, category_id, year, max_speed_mph, max_passengers, price_per_hour, cabin_height_ft, cabin_width_ft, cabin_length_ft, baggage_capacity_cuft, takeoff_distance_ft, landing_distance_ft, fuel_capacity_lbs, image_url, gallery_urls, features, amenities, range_nm) VALUES
    ('Cessna Citation CJ4', 'Cessna', (SELECT id FROM jet_categories WHERE name = 'Light Jet' LIMIT 1), 2023, 528, 8, 2800.00, 4.8, 5.1, 17.8, 60, 3580, 2480, 4600, 'https://api.dicebear.com/7.x/shapes/svg?seed=CJ4&backgroundColor=b6e3f4', ARRAY['https://api.dicebear.com/7.x/shapes/svg?seed=CJ4-1&backgroundColor=b6e3f4', 'https://api.dicebear.com/7.x/shapes/svg?seed=CJ4-2&backgroundColor=b6e3f4'], ARRAY['High-speed internet', 'Satellite phone', 'Entertainment system'], ARRAY['Leather seats', 'Galley', 'Lavatory'], 2165),
    ('Gulfstream G280', 'Gulfstream', (SELECT id FROM jet_categories WHERE name = 'Super Midsize Jet' LIMIT 1), 2023, 559, 10, 4500.00, 6.0, 6.2, 25.0, 120, 5000, 3500, 8000, 'https://api.dicebear.com/7.x/shapes/svg?seed=G280&backgroundColor=b6e3f4', ARRAY['https://api.dicebear.com/7.x/shapes/svg?seed=G280-1&backgroundColor=b6e3f4', 'https://api.dicebear.com/7.x/shapes/svg?seed=G280-2&backgroundColor=b6e3f4'], ARRAY['High-speed internet', 'Satellite phone', 'Entertainment system', 'Stand-up cabin'], ARRAY['Leather seats', 'Full galley', 'Lavatory', 'Crew rest area'], 3600),
    ('Bombardier Challenger 350', 'Bombardier', (SELECT id FROM jet_categories WHERE name = 'Super Midsize Jet' LIMIT 1), 2023, 528, 9, 4200.00, 6.0, 6.2, 25.0, 100, 4800, 3200, 7500, 'https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350&backgroundColor=b6e3f4', ARRAY['https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350-1&backgroundColor=b6e3f4', 'https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350-2&backgroundColor=b6e3f4'], ARRAY['High-speed internet', 'Satellite phone', 'Entertainment system', 'Stand-up cabin'], ARRAY['Leather seats', 'Full galley', 'Lavatory', 'Crew rest area'], 3200);

INSERT INTO contact_info (type, value, label, is_primary) VALUES
    ('email', 'support@aijetbooking.com', '24/7 Support', true),
    ('phone', '+1 (888) 888-8888', 'Mon-Fri: 9AM-6PM EST', true),
    ('address', '123 Aviation Way, New York, NY 10001', 'By Appointment Only', true),
    ('email', 'sales@aijetbooking.com', 'Sales Inquiries', false),
    ('phone', '+1 (888) 777-7777', 'Sales Department', false),
    ('email', 'emergency@aijetbooking.com', 'Emergency Contact', false),
    ('phone', '+1 (888) 999-9999', '24/7 Emergency', false);

INSERT INTO bookings (user_id, jet_id, origin, destination, start_time, end_time, status, passengers, special_requests, total_price) VALUES
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com' LIMIT 1), (SELECT id FROM jets WHERE name = 'Cessna Citation CJ4' LIMIT 1), 'New York', 'Los Angeles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 hours', 'confirmed', 4, 'Vegetarian meal preference', 8400.00),
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com' LIMIT 1), (SELECT id FROM jets WHERE name = 'Gulfstream G280' LIMIT 1), 'Los Angeles', 'Miami', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days 4 hours', 'pending', 6, 'Extra luggage', 18000.00),
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com' LIMIT 1), (SELECT id FROM jets WHERE name = 'Bombardier Challenger 350' LIMIT 1), 'Miami', 'New York', CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '5 days 3 hours', 'confirmed', 8, 'Wheelchair assistance', 12600.00);

INSERT INTO ownership_shares (user_id, jet_id, share_fraction, purchase_date, purchase_price, status) VALUES
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com' LIMIT 1), (SELECT id FROM jets WHERE name = 'Cessna Citation CJ4' LIMIT 1), 0.25, CURRENT_TIMESTAMP, 500000.00, 'active'),
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com' LIMIT 1), (SELECT id FROM jets WHERE name = 'Gulfstream G280' LIMIT 1), 0.50, CURRENT_TIMESTAMP, 2000000.00, 'active'),
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com' LIMIT 1), (SELECT id FROM jets WHERE name = 'Bombardier Challenger 350' LIMIT 1), 0.33, CURRENT_TIMESTAMP, 1500000.00, 'active');

SELECT * FROM jet_categories;
SELECT * FROM memberships;
SELECT * FROM users;
SELECT * FROM jets;
SELECT * FROM contact_info;
SELECT * FROM bookings;
SELECT * FROM ownership_shares; 