import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

export const listUserBookings = {
  name: 'listUserBookings',
  description: 'Get a list of all flight bookings for the currently logged-in user. Use this when the user asks to see their bookings, trips, or reservations.',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  },
  handler: async (params: { context?: ToolHandlerContext }) => {
    try {
      // Extract context from params
      const { context } = params;
      
      // Get token from either direct context or nested in res.locals
      const token = context?.token || context?.res?.locals?.token;
      if (!token) {
        console.error('No authentication token found in context:', context);
        throw new Error('No authentication token found');
      }

      // First, get the current user's ID
      const userResponse = await axios.get(
        `${config.backend.baseUrl}/users/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const userId = userResponse.data.id;
      
      // Then fetch the user's bookings
      const response = await axios.get(
        `${config.backend.baseUrl}/bookings`,
        {
          params: {
            user_id: userId,
            include: 'jet' // Include jet details in the response
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const bookings = response.data || [];
      
      // Create a user-friendly message
      let message = 'Here are your bookings:';
      if (bookings.length === 0) {
        message = 'You have no bookings yet.';
      } else if (bookings.length === 1) {
        message = 'Here is your booking:';
      } else {
        message = `You have ${bookings.length} bookings:`;
      }

      // Format each booking for display
      const formattedBookings = bookings.map((booking: any) => ({
        id: booking.id,
        status: booking.status,
        jet: booking.jet ? booking.jet.name : 'Unknown Jet',
        departure: booking.departure_airport,
        destination: booking.arrival_airport,
        departureTime: booking.departure_time,
        arrivalTime: booking.arrival_time,
        passengers: booking.passenger_count,
        totalPrice: booking.total_price ? `$${booking.total_price.toFixed(2)}` : 'Price not available',
        bookingDate: booking.created_at
      }));
      
      return { 
        success: true, 
        message,
        data: formattedBookings,
        metadata: {
          intent: 'list_bookings',
          confidence: 1,
          entityCount: bookings.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return { 
        success: false, 
        error: 'Failed to fetch your bookings',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'FETCH_BOOKINGS_ERROR'
      };
    }
  }
};
