export interface Jet {
  id: string;
  name: string;
  manufacturer: string;
  category_id: string;
  year?: number;
  max_speed_mph?: number;
  max_passengers?: number;
  price_per_hour?: number;
  cabin_height_ft?: number;
  cabin_width_ft?: number;
  cabin_length_ft?: number;
  baggage_capacity_cuft?: number;
  takeoff_distance_ft?: number;
  landing_distance_ft?: number;
  fuel_capacity_lbs?: number;
  image_url?: string;
  gallery_urls?: string[];
  features?: string[];
  amenities?: string[];
  status: string;
  range_nm: number;
  location?: string;
  created_at: string;
  updated_at: string;
  category?: JetCategory;
}

export interface JetCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  jet_id: string;
  origin: string;
  destination: string;
  start_time: string;
  end_time: string;
  passengers: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_price?: number;
  created_at: string;
  updated_at: string;
}

export interface BookingCreate {
  jet_id: string;
  origin: string;
  destination: string;
  start_time: string;
  end_time: string;
  passengers: number;
  special_requests?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  benefits: string[];
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserMembership {
  id: string;
  user_id: string;
  membership_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  passengers?: number;
  range?: number;
} 