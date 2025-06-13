export interface Jet {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  category_id: 'ultra-long-range' | 'light' | 'midsize' | 'heavy';
  year: number;
  capacity: number;
  range: number;
  status: 'available' | 'maintenance' | 'booked';
  location: string;
  price_per_hour: number;
  imageUrl: string;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  jet_id: string;
  user_id: string;
  departure: string;
  arrival: string;
  departure_time: string;
  arrival_time: string;
  passengers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  type: 'standard' | 'premium' | 'elite';
  status: 'active' | 'cancelled';
  benefits: string[];
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  type: 'booking' | 'revenue' | 'membership' | 'usage';
  start_date: string;
  end_date: string;
  data: {
    total_bookings: number;
    total_revenue: number;
    average_booking_value: number;
    top_routes: Array<{
      route: string;
      bookings: number;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  recipient: string;
  type: 'booking' | 'membership' | 'system';
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
} 