import api from './api';
import { Booking } from '../types';

export const bookingService = {
  // Create a new booking
  createBooking: async (booking: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Booking> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  // Get all bookings for the current user
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Get booking details
  getBookingDetails: async (bookingId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (bookingId: string): Promise<void> => {
    await api.delete(`/bookings/${bookingId}`);
  }
}; 