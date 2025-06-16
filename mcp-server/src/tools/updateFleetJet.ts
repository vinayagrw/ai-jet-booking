import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

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
      },
      context: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'Authentication token'
          }
        }
      }
    },
    required: ['jetId', 'status', 'context']
  },
  handler: async (params: any & { context?: ToolHandlerContext }) => {
    // Extract context from params and then remove it to avoid sending it in the request
    const { context, ...updateParams } = params;
    
    // Get token from context
    const token = context?.token || context?.res?.locals?.token;
    if (!token) {
      console.error('No authentication token found in context:', context);
      throw new Error('No authentication token found');
    }
    try {
      const response = await axios.put(
        `${config.backend.baseUrl}${config.backend.endpoints.jets}/${updateParams.jetId}`,
        { status: updateParams.status },
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
      console.error('Error updating fleet jet:', error);
      return { success: false, error: 'Failed to update fleet jet' };
    }
  }
}; 