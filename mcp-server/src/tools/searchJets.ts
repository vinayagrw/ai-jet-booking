import axios from 'axios';
import { config } from '../config';

interface SearchJetsParams {
  departure?: string;
  arrival?: string;
  date?: string;
  jetSize?: string;
  passengers?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export const searchJets = {
  name: 'searchJets',
  description: 'Search for available jets based on criteria.',
  parameters: {
    type: 'object',
    properties: {
      departure: { type: 'string', description: 'Departure location' },
      arrival: { type: 'string', description: 'Arrival location' },
      date: { type: 'string', description: 'Travel date' },
      passengers: { type: 'number', description: 'Number of passengers' }
    },
    required: ['departure', 'arrival', 'date', 'passengers']
  },
  handler: async (params: any) => {
    try {
      const response = await axios.get(`${config.backend.baseUrl}/api/v1/jets/search`, {
        params,
        headers: {
          'Authorization': `${config.backend.auth.headerPrefix} ${config.backend.auth.token}`
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to search jets' };
    }
  }
}; 