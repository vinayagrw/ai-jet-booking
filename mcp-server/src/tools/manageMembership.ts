import axios from 'axios';
import { config } from '../config.js';

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
      }
    },
    required: ['userId', 'membershipId', 'action']
  },
  handler: async (params: any) => {
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}${config.backend.endpoints.memberships.enroll}`,
        {
          userId: params.userId,
          membershipId: params.membershipId
        },
        {
          headers: {
            [config.backend.auth.headerName]: `${config.backend.auth.headerPrefix} ${config.backend.auth.token}`
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