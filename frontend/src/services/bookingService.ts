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

  console.log('Fetching bookings from:', `${API_URL}/api/v1/bookings/`);

  try {
    const response = await fetch(`${API_URL}/api/v1/bookings/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(errorData.detail || 'Failed to fetch bookings');
    }

    const data = await response.json();
    console.log('Received bookings data:', data);
    return data;
  } catch (error) {
    console.error('Error in getBookings:', error);
    throw error;
  }
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

  console.log('Creating booking:', booking);

  try {
    const response = await fetch(`${API_URL}/api/v1/bookings/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(booking)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(errorData.detail || 'Failed to create booking');
    }

    const data = await response.json();
    console.log('Created booking:', data);
    return data;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

/**
 * Gets details of a specific booking
 * @param id Booking ID
 * @returns Promise<Booking> The booking details
 */
export const getBookingById = async (id: string): Promise<Booking> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Fetching booking:', id);

  try {
    const response = await fetch(`${API_URL}/api/v1/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(errorData.detail || 'Failed to fetch booking');
    }

    const data = await response.json();
    console.log('Received booking data:', data);
    return data;
  } catch (error) {
    console.error('Error in getBookingById:', error);
    throw error;
  }
};

/**
 * Cancels a booking
 * @param id Booking ID
 * @returns Promise<void>
 */
export const cancelBooking = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('Cancelling booking:', id);

  try {
    const response = await fetch(`${API_URL}/api/v1/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(errorData.detail || 'Failed to cancel booking');
    }

    console.log('Successfully cancelled booking:', id);
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    throw error;
  }
}; 