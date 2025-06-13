import axios from 'axios';
import { config } from '../config.js';

interface SendNotificationParams {
  recipient: string;
  type: string;
  subject: string;
  content: string;
  priority?: string;
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
    try {
      const response = await axios.post(`${config.backend.baseUrl}${config.backend.endpoints.notifications.send}`, params);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }
}; 