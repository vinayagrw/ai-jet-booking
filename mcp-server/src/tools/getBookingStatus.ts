import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

interface GetBookingStatusParams {
  booking_id: string;
}

export const getBookingStatus = {
  description: 'Get the status of a booking',
  parameters: {
    booking_id: 'string'
  },
  handler: async (params: GetBookingStatusParams & { context?: ToolHandlerContext }) => {
    try {
      // Extract context from params and then remove it to avoid polluting the query params
      const { context, ...queryParams } = params;
      
      // Get token from either direct context or nested in res.locals
      const token = context?.token || context?.res?.locals?.token;
      if (!token) {
        console.error('No authentication token found in context:', context);
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${config.backend.baseUrl}/bookings/${queryParams.booking_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting booking status:', error);
      return { 
        success: false, 
        error: 'Failed to get booking status',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'BOOKING_STATUS_ERROR'
      };
    }
  }
}; 