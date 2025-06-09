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
  userId: string;
  jetId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  benefits: string[];
  maxBookings: number;
  discount: number; // percentage
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  passengers?: number;
  range?: number;
} 