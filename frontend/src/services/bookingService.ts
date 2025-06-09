import { Booking, BookingCreate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetches all bookings for the current user
 * @returns Promise<Booking[]> Array of bookings
 */
export const getBookings = async (): Promise<Booking[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/api/v1/bookings/my-bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch bookings');
  }

  return response.json();
};

/**
 * Creates a new booking
 * @param booking BookingCreate object containing booking details
 * @returns Promise<Booking> The created booking
 */
export const createBooking = async (booking: BookingCreate): Promise<Booking> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/api/v1/bookings/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create booking');
  }

  return response.json();
};

/**
 * Cancels a booking
 * @param bookingId ID of the booking to cancel
 * @returns Promise<void>
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/api/v1/bookings/${bookingId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel booking');
  }
};

/**
 * Gets details of a specific booking
 * @param bookingId ID of the booking to fetch
 * @returns Promise<Booking> The booking details
 */
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/api/v1/bookings/${bookingId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch booking details');
  }

  return response.json();
}; 