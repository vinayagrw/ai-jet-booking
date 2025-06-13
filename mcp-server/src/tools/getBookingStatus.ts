import axios from 'axios';
import { config } from '../config.js';

interface GetBookingStatusParams {
  booking_id: string;
}

export const getBookingStatus = {
  description: 'Get the status of a booking',
  parameters: {
    booking_id: 'string'
  },
  handler: async (params: GetBookingStatusParams) => {
    try {
      const response = await axios.get(
        `${config.backend.baseUrl}${config.backend.endpoints.bookings.get(params.booking_id)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting booking status:', error);
      throw new Error('Failed to get booking status');
    }
  }
}; 