import axios from 'axios';
import { config } from '../config.js';

export const createUser = {
  name: 'createUser',
  description: 'Register a new user',
  parameters: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address for the user'
      },
      password: {
        type: 'string',
        description: 'Password for the user'
      },
      name: {
        type: 'string',
        description: 'Full name of the user'
      }
    },
    required: ['email', 'password', 'name']
  },
  handler: async (params: any) => {
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}${config.backend.auth.endpoints.register}`,
        {
          email: params.email,
          password: params.password,
          name: params.name
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }
}; 