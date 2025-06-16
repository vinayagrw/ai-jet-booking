import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

export const manageMembership = {
  name: 'manageMembership',
  description: 'Manage user membership (enroll, cancel, or update)',
  parameters: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'ID of the user'
      },
      membershipId: {
        type: 'string',
        description: 'ID of the membership plan'
      },
      action: {
        type: 'string',
        description: 'Action to perform (enroll, cancel, update)',
        enum: ['enroll', 'cancel', 'update']
      },
      context: {
        type: 'object',
        description: 'Tool handler context'
      }
    },
    required: ['userId', 'membershipId', 'action']
  },
  handler: async (params: any & { context?: ToolHandlerContext }) => {
    // Extract context from params and then remove it to avoid sending it in the request
    const { context, ...membershipParams } = params;
    
    // Get token from context
    const token = context?.token || context?.res?.locals?.token;
    if (!token) {
      console.error('No authentication token found in context:', context);
      throw new Error('No authentication token found');
    }
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}${config.backend.endpoints.memberships}`,
        {
          userId: membershipParams.userId,
          membershipId: membershipParams.membershipId,
          action: membershipParams.action
        },
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
      console.error('Error managing membership:', error);
      return { success: false, error: 'Failed to manage membership' };
    }
  }
}; 