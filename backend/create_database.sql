-- Create database if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ai_jet_booking') THEN
        CREATE DATABASE ai_jet_booking;
    END IF;
END $$;

-- Connect to the database
\c ai_jet_booking;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS ownership_shares CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS user_memberships CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS jets CASCADE;
DROP TABLE IF EXISTS jet_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;

-- Create tables in correct order
CREATE TABLE jet_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration_months INTEGER,
    benefits TEXT[],
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image_url VARCHAR(255),
    membership_id UUID REFERENCES memberships(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES jet_categories(id),
    year INTEGER,
    max_speed_mph INTEGER,
    max_passengers INTEGER,
    price_per_hour DECIMAL(10,2),
    cabin_height_ft DECIMAL(4,1),
    cabin_width_ft DECIMAL(4,1),
    cabin_length_ft DECIMAL(4,1),
    baggage_capacity_cuft INTEGER,
    takeoff_distance_ft INTEGER,
    landing_distance_ft INTEGER,
    fuel_capacity_lbs INTEGER,
    image_url VARCHAR(255),
    gallery_urls TEXT[],
    features TEXT[],
    amenities TEXT[],
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    range_nm INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    label VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    membership_id UUID REFERENCES memberships(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    jet_id UUID REFERENCES jets(id),
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    passengers INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ownership_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    jet_id UUID REFERENCES jets(id),
    share_fraction FLOAT,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'sold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO jet_categories (name, description, image_url) VALUES
    ('Light Jet', 'Small, efficient jets perfect for short to medium-range flights', 'https://api.dicebear.com/7.x/shapes/svg?seed=LightJet&backgroundColor=b6e3f4'),
    ('Midsize Jet', 'Versatile jets offering a balance of range and comfort', 'https://api.dicebear.com/7.x/shapes/svg?seed=MidsizeJet&backgroundColor=b6e3f4'),
    ('Super Midsize Jet', 'Larger jets with extended range and enhanced amenities', 'https://api.dicebear.com/7.x/shapes/svg?seed=SuperMidsizeJet&backgroundColor=b6e3f4'),
    ('Large Jet', 'Premium jets offering maximum comfort and range', 'https://api.dicebear.com/7.x/shapes/svg?seed=LargeJet&backgroundColor=b6e3f4');

INSERT INTO users (name, email, password_hash, role, first_name, last_name, phone, profile_image_url) VALUES
    ('Admin User', 'admin@aijetbooking.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQN3J9.5JQHy', 'admin', 'Admin', 'User', '+1234567890', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
    ('John Smith', 'john.smith@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQN3J9.5JQHy', 'user', 'John', 'Smith', '+1987654321', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'),
    ('Sarah Johnson', 'sarah.j@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQN3J9.5JQHy', 'user', 'Sarah', 'Johnson', '+1122334455', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah');

INSERT INTO memberships (name, description, price, duration_months, benefits, image_url) VALUES
    ('Basic', 'Essential benefits for occasional travelers', 999.00, 12, ARRAY['Priority booking', '5% discount on flights', 'Basic concierge service'], 'https://api.dicebear.com/7.x/shapes/svg?seed=Basic&backgroundColor=b6e3f4'),
    ('Premium', 'Enhanced benefits for frequent travelers', 1999.00, 12, ARRAY['Priority booking', '10% discount on flights', 'Premium concierge service', 'Complimentary ground transportation'], 'https://api.dicebear.com/7.x/shapes/svg?seed=Premium&backgroundColor=b6e3f4'),
    ('Elite', 'Ultimate benefits for VIP travelers', 3999.00, 12, ARRAY['Priority booking', '15% discount on flights', 'Elite concierge service', 'Complimentary ground transportation', 'Access to exclusive events'], 'https://api.dicebear.com/7.x/shapes/svg?seed=Elite&backgroundColor=b6e3f4');

INSERT INTO jets (name, manufacturer, category_id, year, max_speed_mph, max_passengers, price_per_hour, cabin_height_ft, cabin_width_ft, cabin_length_ft, baggage_capacity_cuft, takeoff_distance_ft, landing_distance_ft, fuel_capacity_lbs, image_url, gallery_urls, features, amenities, range_nm) VALUES
    ('Cessna Citation CJ4', 'Cessna', (SELECT id FROM jet_categories WHERE name = 'Light Jet'), 2023, 528, 8, 2800.00, 4.8, 5.1, 17.8, 60, 3580, 2480, 4600, 'https://api.dicebear.com/7.x/shapes/svg?seed=CJ4&backgroundColor=b6e3f4', ARRAY['https://api.dicebear.com/7.x/shapes/svg?seed=CJ4-1&backgroundColor=b6e3f4', 'https://api.dicebear.com/7.x/shapes/svg?seed=CJ4-2&backgroundColor=b6e3f4'], ARRAY['High-speed internet', 'Satellite phone', 'Entertainment system'], ARRAY['Leather seats', 'Galley', 'Lavatory'], 2165),
    ('Gulfstream G280', 'Gulfstream', (SELECT id FROM jet_categories WHERE name = 'Super Midsize Jet'), 2023, 559, 10, 4500.00, 6.0, 6.2, 25.0, 120, 5000, 3500, 8000, 'https://api.dicebear.com/7.x/shapes/svg?seed=G280&backgroundColor=b6e3f4', ARRAY['https://api.dicebear.com/7.x/shapes/svg?seed=G280-1&backgroundColor=b6e3f4', 'https://api.dicebear.com/7.x/shapes/svg?seed=G280-2&backgroundColor=b6e3f4'], ARRAY['High-speed internet', 'Satellite phone', 'Entertainment system', 'Stand-up cabin'], ARRAY['Leather seats', 'Full galley', 'Lavatory', 'Crew rest area'], 3600),
    ('Bombardier Challenger 350', 'Bombardier', (SELECT id FROM jet_categories WHERE name = 'Super Midsize Jet'), 2023, 528, 9, 4200.00, 6.0, 6.2, 25.0, 100, 4800, 3200, 7500, 'https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350&backgroundColor=b6e3f4', ARRAY['https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350-1&backgroundColor=b6e3f4', 'https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350-2&backgroundColor=b6e3f4'], ARRAY['High-speed internet', 'Satellite phone', 'Entertainment system', 'Stand-up cabin'], ARRAY['Leather seats', 'Full galley', 'Lavatory', 'Crew rest area'], 3200);

INSERT INTO contact_info (type, value, label, is_primary) VALUES
    ('email', 'support@aijetbooking.com', '24/7 Support', true),
    ('phone', '+1 (888) 888-8888', 'Mon-Fri: 9AM-6PM EST', true),
    ('address', '123 Aviation Way, New York, NY 10001', 'By Appointment Only', true),
    ('email', 'sales@aijetbooking.com', 'Sales Inquiries', false),
    ('phone', '+1 (888) 777-7777', 'Sales Department', false),
    ('email', 'emergency@aijetbooking.com', 'Emergency Contact', false),
    ('phone', '+1 (888) 999-9999', '24/7 Emergency', false);

INSERT INTO bookings (user_id, jet_id, origin, destination, start_time, end_time, status, passengers, special_requests, total_price) VALUES
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com'), (SELECT id FROM jets WHERE name = 'Cessna Citation CJ4'), 'New York', 'Los Angeles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 hours', 'confirmed', 4, 'Vegetarian meal preference', 8400.00),
    ((SELECT id FROM users WHERE email = 'john.smith@example.com'), (SELECT id FROM jets WHERE name = 'Gulfstream G280'), 'Los Angeles', 'Miami', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days 4 hours', 'pending', 6, 'Extra luggage', 18000.00),
    ((SELECT id FROM users WHERE email = 'sarah.j@example.com'), (SELECT id FROM jets WHERE name = 'Bombardier Challenger 350'), 'Miami', 'New York', CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '5 days 3 hours', 'confirmed', 8, 'Wheelchair assistance', 12600.00);

INSERT INTO ownership_shares (user_id, jet_id, share_fraction, purchase_date, purchase_price, status) VALUES
    ((SELECT id FROM users WHERE email = 'admin@aijetbooking.com'), (SELECT id FROM jets WHERE name = 'Cessna Citation CJ4'), 0.25, CURRENT_TIMESTAMP, 500000.00, 'active'),
    ((SELECT id FROM users WHERE email = 'john.smith@example.com'), (SELECT id FROM jets WHERE name = 'Gulfstream G280'), 0.50, CURRENT_TIMESTAMP, 2000000.00, 'active'),
    ((SELECT id FROM users WHERE email = 'sarah.j@example.com'), (SELECT id FROM jets WHERE name = 'Bombardier Challenger 350'), 0.33, CURRENT_TIMESTAMP, 1500000.00, 'active'); 


ALTER TABLE jet_categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();    