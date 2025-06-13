import axios from 'axios';
import { config } from '../config.js';

export const updateFleetJet = {
  name: 'updateFleetJet',
  description: 'Update a jet in the fleet',
  parameters: {
    type: 'object',
    properties: {
      jetId: {
        type: 'string',
        description: 'ID of the jet to update'
      },
      status: {
        type: 'string',
        description: 'New status of the jet',
        enum: ['available', 'maintenance', 'booked']
      }
    },
    required: ['jetId', 'status']
  },
  handler: async (params: any) => {
    try {
      const response = await axios.put(
        `${config.backend.baseUrl}${config.backend.endpoints.jets.update(params.jetId)}`,
        { status: params.status },
        {
          headers: {
            [config.backend.auth.headerName]: `${config.backend.auth.headerPrefix} ${config.backend.auth.token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating fleet jet:', error);
      return { success: false, error: 'Failed to update fleet jet' };
    }
  }
}; 