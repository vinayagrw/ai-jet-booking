import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

interface SendNotificationParams {
  recipient: string;
  type: string;
  subject: string;
  content: string;
  priority?: string;
  context?: ToolHandlerContext;
}

export const sendNotification = {
  description: 'Send a notification',
  parameters: {
    recipient: 'string',
    type: 'string',
    subject: 'string',
    content: 'string',
    priority: 'string (optional)'
  },
  handler: async (params: SendNotificationParams) => {
    // Extract context from params and then remove it to avoid sending it in the request
    const { context, ...notificationParams } = params;
    
    // Get token from context
    const token = context?.token || context?.res?.locals?.token;
    if (!token) {
      console.error('No authentication token found in context:', context);
      throw new Error('No authentication token found');
    }
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}/notifications/send`,
        notificationParams,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }
}; 