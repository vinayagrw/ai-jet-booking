import axios from 'axios';
import { config } from '../config.js';

export const authenticate = {
  name: 'authenticate',
  description: 'Authenticate a user and get access token',
  parameters: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address for authentication'
      },
      password: {
        type: 'string',
        description: 'Password for authentication'
      }
    },
    required: ['email', 'password']
  },
  handler: async (params: any) => {
    try {
      const form = new URLSearchParams();
      form.append('username', params.email);
      form.append('password', params.password);

      const response = await axios.post(
        `${config.backend.baseUrl}${config.backend.auth.endpoints.login}`,
        form,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      if (response.data.access_token) {
        // Update the config with the new token
        config.backend.auth.token = response.data.access_token;
        return { 
          success: true, 
          data: { 
            message: 'Authentication successful',
            token: response.data.access_token 
          }
        };
      }
      
      return { success: false, error: 'No access token received' };
    } catch (error) {
      console.error('Error authenticating:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
}; 