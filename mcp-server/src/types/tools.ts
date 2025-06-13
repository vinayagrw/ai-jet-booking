import { z } from 'zod';

export interface Tool<TParams = any, TResult = any> {
  name: string;
  description: string;
  parameters: z.ZodType<TParams>;
  handler: (params: TParams) => Promise<TResult>;
}

export interface SearchJetsParams {
  departure: string;
  arrival: string;
  date: string;
  jetSize?: 'ultra-long-range' | 'light' | 'midsize' | 'heavy';
  passengers?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface CreateBookingParams {
  jet_id: string;
  user_id: string;
  departure: string;
  arrival: string;
  departure_time: string;
  arrival_time: string;
  passengers: number;
}

export interface GetBookingStatusParams {
  booking_id: string;
}

export interface UpdateFleetJetParams {
  jet_id: string;
  status: 'available' | 'maintenance' | 'booked';
  location?: string;
}

export interface ManageMembershipParams {
  user_id: string;
  action: 'create' | 'update' | 'cancel';
  type?: 'standard' | 'premium' | 'elite';
  benefits?: string[];
}

export interface GenerateReportParams {
  type: 'booking' | 'revenue' | 'membership' | 'usage';
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
}

export interface SendNotificationParams {
  recipient: string;
  type: 'booking' | 'membership' | 'system';
  subject: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
} 