import axios from 'axios';
import { config } from '../config.js';
import { ToolHandler, ToolHandlerContext } from './index.js';

interface SearchJetsParams {
  category?: 'light' | 'midsize' | 'heavy' | 'ultra_long_range';
  min_price?: number;
  max_price?: number;
  location?: string;
  passengers?: number;
  range?: number;
}

export const searchJets = {
  name: 'searchJets',
  description: 'Search for available private jets based on various criteria like location, date, and passenger count. Use this when the user wants to find available flights or jets.',
  parameters: {
    type: 'object',
    properties: {
      category: { 
        type: 'string', 
        description: 'Jet category (e.g., light, midsize, heavy)',
        enum: ['light', 'midsize', 'heavy', 'ultra_long_range']
      },
      min_price: { 
        type: 'number', 
        description: 'Minimum price per hour',
        minimum: 0
      },
      max_price: { 
        type: 'number', 
        description: 'Maximum price per hour',
        minimum: 0
      },
      location: { 
        type: 'string', 
        description: 'Current location of the jet' 
      },
      passengers: { 
        type: 'number', 
        description: 'Minimum number of passengers required',
        minimum: 1
      },
      range: { 
        type: 'number', 
        description: 'Minimum range in nautical miles required',
        minimum: 0
      }
    },
    required: []
  },
  handler: async (params: SearchJetsParams & { context?: ToolHandlerContext }) => {
    try {
      // Extract context from params and then remove it to avoid polluting the query params
      const { context, ...queryParams } = params;
      
      // Get token from either direct context or nested in res.locals
      const token = context?.token || context?.res?.locals?.token;
      if (!token) {
        console.error('No authentication token found in context:', context);
        throw new Error('No authentication token found');
      }

      // Build query parameters
      const searchParams = new URLSearchParams();
      if (queryParams.category) searchParams.append('category', queryParams.category);
      if (queryParams.min_price) searchParams.append('min_price', queryParams.min_price.toString());
      if (queryParams.max_price) searchParams.append('max_price', queryParams.max_price.toString());
      if (queryParams.location) searchParams.append('location', queryParams.location);
      if (queryParams.passengers) searchParams.append('passengers', queryParams.passengers.toString());
      if (queryParams.range) searchParams.append('range', queryParams.range.toString());

      // Call the backend API
      const response = await axios.get(`${config.backend.baseUrl}/jets/search?${searchParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Format the response for chat display
      const jets = response.data || [];
      
      // Create a user-friendly message
      let message = 'I found the following jets for you:';
      if (jets.length === 0) {
        message = 'No jets found matching your criteria.';
      } else if (jets.length === 1) {
        message = 'I found 1 jet matching your criteria:';
      } else {
        message = `I found ${jets.length} jets matching your criteria:`;
      }

      // Format each jet for display
      const formattedJets = jets.map((jet: any) => ({
        id: jet.id,
        name: jet.name,
        manufacturer: jet.manufacturer,
        year: jet.year,
        maxSpeed: jet.max_speed_mph ? `${jet.max_speed_mph} mph` : 'N/A',
        range: jet.range_nm ? `${jet.range_nm} nm` : 'N/A',
        capacity: jet.max_passengers || 'N/A',
        pricePerHour: jet.hourly_rate ? `$${jet.hourly_rate}/hour` : 'Price on request'
      }));

      return {
        success: true,
        message,
        data: formattedJets,
        metadata: {
          intent: 'search_results',
          confidence: 1,
          entities: {
            category: queryParams.category,
            minPrice: queryParams.min_price,
            maxPrice: queryParams.max_price,
            location: queryParams.location,
            passengers: queryParams.passengers,
            range: queryParams.range
          },
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error: any) {
      console.error('Error searching jets:', error);
      const errorDetails = {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.response?.data?.code || 'SEARCH_ERROR'
      };
      console.error('Error details:', errorDetails);
      
      return { 
        success: false, 
        error: 'Failed to search for jets. Please try again later.',
        details: errorDetails.message,
        code: errorDetails.code
      };
    }
  }
}; 