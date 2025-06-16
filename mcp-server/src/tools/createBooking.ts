import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

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
  handler: async (params: any & { context?: ToolHandlerContext }) => {
    // Extract context from params and then remove it to avoid sending it in the request
    const { context, ...bookingParams } = params;
    
    // Get token from either direct context or nested in res.locals
    const token = context?.token || context?.res?.locals?.token;
    if (!token) {
      console.error('No authentication token found in context:', context);
      throw new Error('No authentication token found');
    }
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}/bookings`,
        bookingParams,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return { 
        success: true, 
        data: response.data,
        message: 'Booking created successfully' 
      };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return { 
        success: false, 
        error: 'Failed to create booking',
        details: error.response?.data?.detail || error.message || 'Unknown error'
      };
    }
  }
}; 