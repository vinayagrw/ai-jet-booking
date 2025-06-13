import axios from 'axios';
import { config } from '../config.js';

interface GenerateReportParams {
  type: string;
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
}

export const generateReport = {
  description: 'Generate a report',
  parameters: {
    type: 'string',
    start_date: 'string',
    end_date: 'string',
    filters: 'object (optional)'
  },
  handler: async (params: GenerateReportParams) => {
    try {
      const response = await axios.post(`${config.backend.baseUrl}${config.backend.endpoints.reports.generate}`, {
        type: params.type,
        start_date: params.start_date,
        end_date: params.end_date,
        filters: params.filters
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  }
}; 