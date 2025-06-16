import axios from 'axios';
import { authService } from './auth';

const MCP_URL = 'http://localhost:3010';

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  data?: any;
  isLoading?: boolean;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: Record<string, any>;
    error?: string | boolean;
  };
}

interface MCPResponse {
  success: boolean;
  message?: string;
  data?: any;
  intent?: string;
  confidence?: number;
  entities?: Record<string, any>;
  error?: string;
}

export const chatService = {
  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Not authenticated. Please log in again.');
      }
      
      console.log('Sending message with token:', token.substring(0, 20) + '...');
      
      const response = await axios.post<MCPResponse>(
        `${MCP_URL}/ai/concierge`,
        { 
          message,
          // Include the token in the request body as well for MCP server
          token: token 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Auth-Token': token // Additional header for MCP server
          },
          withCredentials: true
        }
      );

      console.log('MCP Server Response:', JSON.stringify(response.data, null, 2));
      
      // Debug: Log the structure of the response data
      if (response.data.data) {
        console.log('Response data type:', typeof response.data.data);
        if (Array.isArray(response.data.data)) {
          console.log('Data is an array with length:', response.data.data.length);
          if (response.data.data.length > 0) {
            console.log('First item in data array:', response.data.data[0]);
          }
        } else if (typeof response.data.data === 'object') {
          console.log('Data is an object with keys:', Object.keys(response.data.data));
        }
      }
      
      // Handle error responses
      if (!response.data.success) {
        return this.createBotMessage(
          response.data.error || 'I encountered an error processing your request.',
          { intent: 'error', confidence: 1, error: true },
          {}
        );
      }
      
      // Handle array data - check both direct data and nested data property
      const responseData = response.data.data?.data || response.data.data;
      if (responseData && Array.isArray(responseData)) {
        if (responseData.length > 0) {
          return this.createBotMessage(
            response.data.message || `I found ${responseData.length} items matching your criteria.`,
            {
              intent: response.data.intent || 'search_results',
              confidence: response.data.confidence || 1.0,
              entities: response.data.entities || {},
            },
            responseData
          );
        } else {
          return this.createBotMessage(
            response.data.message || 'No items found matching your criteria. Please try a different search.',
            {
              intent: response.data.intent || 'no_results',
              confidence: 1.0,
              entities: {}
            },
            []
          );
        }
      }
      
      // Handle object data - check both direct data and nested data property
      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        return this.createBotMessage(
          response.data.message || 'Here is the information you requested:',
          {
            intent: response.data.intent || 'data_response',
            confidence: response.data.confidence || 1.0,
            entities: response.data.entities || {}
          },
          responseData
        );
      }
      
      // Handle direct message
      if (response.data.message) {
        return this.createBotMessage(
          response.data.message,
          {
            intent: response.data.intent || 'response',
            confidence: response.data.confidence || 1.0,
            entities: response.data.entities || {},
          },
          response.data.data || {}
        );
      }
      
      // Default response
      return this.createBotMessage(
        'I found some information for you.',
        {
          intent: response.data.intent || 'response',
          confidence: response.data.confidence || 1.0,
          entities: response.data.entities || {},
        },
        response.data.data || {}
      );
      
    } catch (error: any) {
      console.error('Error in chatService.sendMessage:', error);
      return this.createBotMessage(
        'Sorry, I encountered an error processing your request. Please try again.',
        {
          intent: 'error',
          confidence: 1.0,
          error: error.message,
        },
        {}
      );
    }
  },
  
  createBotMessage(
    text: string, 
    metadata: ChatMessage['metadata'] = {},
    data: any = {}
  ): ChatMessage {
    return {
      from: 'bot',
      text,
      data,
      metadata: {
        intent: 'response',
        confidence: 1.0,
        entities: {},
        ...metadata
      }
    };
  },
  
  createLoadingMessage(): ChatMessage {
    return {
      from: 'bot',
      text: 'Processing your request...',
      isLoading: true,
      metadata: {
        intent: 'processing',
        confidence: 1.0
      }
    };
  }
};
