import axios from 'axios';
import { config } from '../config.js';

export const createBooking = {
  name: 'createBooking',
  description: 'Create a new booking',
  parameters: {
    type: 'object',
    properties: {
      jet_id: {
        type: 'string',
        description: 'ID of the jet to book'
      },
      user_id: {
        type: 'string',
        description: 'ID of the user making the booking'
      },
      departure: {
        type: 'string',
        description: 'Departure location'
      },
      arrival: {
        type: 'string',
        description: 'Arrival location'
      },
      passengers: {
        type: 'number',
        description: 'Number of passengers'
      }
    },
    required: ['jet_id', 'user_id', 'departure', 'arrival', 'passengers']
  },
  handler: async (params: any) => {
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}${config.backend.endpoints.bookings}`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            [config.backend.auth.headerName]: `${config.backend.auth.headerPrefix} ${config.backend.auth.token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: 'Failed to create booking' };
    }
  }
}; 