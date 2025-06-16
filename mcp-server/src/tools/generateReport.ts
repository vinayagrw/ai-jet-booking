import axios from 'axios';
import { config } from '../config.js';
import { ToolHandlerContext } from './index.js';

interface GenerateReportParams {
  type: string;
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
  context?: ToolHandlerContext;
}

export const generateReport = {
  description: 'Generate a report',
  parameters: {
    type: 'string',
    start_date: 'string',
    end_date: 'string',
    filters: 'object (optional)',
    context: 'object (optional)'
  },
  handler: async (params: GenerateReportParams) => {
    // Extract context from params
    const { context } = params;
    
    // Get token from context
    const token = context?.token || context?.res?.locals?.token;
    if (!token) {
      console.error('No authentication token found in context:', context);
      throw new Error('No authentication token found');
    }
    try {
      const response = await axios.post(
        `${config.backend.baseUrl}/reports/generate`,
        {
          type: params.type,
          start_date: params.start_date,
          end_date: params.end_date,
          filters: params.filters
        },
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
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  }
}; 