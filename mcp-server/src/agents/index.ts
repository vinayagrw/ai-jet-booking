import { LocalLLMClient } from '../llm/localClient.js';
import { ToolHandlerContext } from '../tools/index.js';
import { tools, Tool } from './tools.js';

export * from './reportingAgent.js';

export { tools };

// Define the response type for our wrapped tools
export interface ToolResponse {
  success: boolean;
  data: any;
  message: string;
  metadata?: Record<string, any>;
}

// Define the ToolHandler type that matches our tool handler signatures
export type ToolHandler<T = any> = (params: T & { context: ToolHandlerContext }) => Promise<ToolResponse>;

// Define a type for wrapped tools that includes description
export interface ToolWithDescription<T = any> extends ToolHandler<T> {
  description?: string;
  parameters?: Record<string, any>;
}

export class AIConcierge {
  private llm: LocalLLMClient;

  constructor() {
    this.llm = new LocalLLMClient();
  }

  async handleRequest(message: string, req?: any) {
    try {
      // Extract token from request
      const token = req?.token || 
                  req?.body?.token || 
                  (req?.headers?.authorization?.split(' ')[1]);
      
      if (!token) {
        console.error('No authentication token found in request');
        return {
          success: false,
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
          message: 'Please log in to access this feature.'
        };
      }

      // Create context with token for downstream API calls
      const context: ToolHandlerContext = { 
        token,
        res: { 
          locals: { token } 
        }
      };

      // Define wrapped tool functions with proper typing
      const wrappedTools: Record<string, ToolWithDescription> = {
        searchJets: async (params: any) => {
          console.log('Calling searchJets with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.searchJets.handler({ ...params, context });
            return {
              success: true,
              data: result,
              message: 'Search results retrieved successfully.'
            };
          } catch (error) {
            console.error('Error in searchJets:', error);
            throw error;
          }
        },
        createBooking: async (params: any) => {
          console.log('Calling createBooking with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.createBooking.handler({ ...params, context });
            return {
              success: true,
              data: result,
              message: 'Booking created successfully.'
            };
          } catch (error) {
            console.error('Error in createBooking:', error);
            throw error;
          }
        },
        getBookingStatus: async (params: any) => {
          console.log('Calling getBookingStatus with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.getBookingStatus.handler({ ...params, context });
            return {
              success: true,
              data: result,
              message: 'Booking status retrieved successfully.'
            };
          } catch (error) {
            console.error('Error in getBookingStatus:', error);
            throw error;
          }
        },
        listUserBookings: async (params: any) => {
          console.log('Calling listUserBookings with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.listUserBookings.handler({ ...params, context });
            return {
              success: true,
              data: result,
              message: 'User bookings retrieved successfully.'
            };
          } catch (error) {
            console.error('Error in listUserBookings:', error);
            throw error;
          }
        },
        noToolNeeded: async () => {
          console.log('No tool needed for this request');
          return {
            success: true,
            data: null,
            message: 'I understand your request but no specific tool is needed.'
          };
        }
      };

      // Add descriptions to tools
      wrappedTools.searchJets.description = 'Search for available jets based on criteria';
      wrappedTools.createBooking.description = 'Create a new booking';
      wrappedTools.getBookingStatus.description = 'Get status of a specific booking';
      wrappedTools.listUserBookings.description = 'List all bookings for the current user';

      // Generate response using LLM with wrapped tools
      const response = await this.llm.generateWithTools(message, wrappedTools);
      
      if (response.error) {
        console.error('LLM returned an error:', response.error);
        return {
          success: false,
          error: response.error,
          code: 'LLM_ERROR',
          message: 'I encountered an error while processing your request.'
        };
      }

      // Parse LLM response and execute tool
      let toolCall: { tool?: string; params?: any } = {};
      try {
        toolCall = JSON.parse(response.text);
        if (!toolCall.tool) {
          return await wrappedTools.noToolNeeded();
        }
      } catch (e) {
        console.error('Failed to parse LLM response:', e);
        return await wrappedTools.noToolNeeded();
      }

      const { tool, params = {} } = toolCall;
      const toolHandler = wrappedTools[tool as keyof typeof wrappedTools];

      if (!toolHandler) {
        return await wrappedTools.noToolNeeded();
      }

      try {
        const result = await toolHandler(params);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error executing tool ${tool}:`, error);
        return {
          success: false,
          error: errorMessage,
          code: 'TOOL_EXECUTION_ERROR',
          message: `I encountered an error while processing your request: ${errorMessage}`
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in AIConcierge handleRequest:', error);
      return {
        success: false,
        error: errorMessage,
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.'
      };
    }
  }
}

export class AdminAssistant {
  private llm: LocalLLMClient;

  constructor() {
    this.llm = new LocalLLMClient();
  }

  async handleRequest(message: string, req?: any) {
    try {
      // Extract token from request
      const token = req?.token || 
                  req?.body?.token || 
                  (req?.headers?.authorization?.split(' ')[1]);
      
      if (!token) {
        console.error('No authentication token found in request');
        return {
          success: false,
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
          message: 'Please log in to access admin features.'
        };
      }

      // Create context with token for downstream API calls
      const context: ToolHandlerContext = { 
        token,
        res: { 
          locals: { token } 
        }
      };

      // Define admin tool functions with proper typing
      const wrappedTools: Record<string, ToolWithDescription<any>> = {
        updateFleetJet: async (params: any) => {
          console.log('Calling updateFleetJet with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.updateFleetJet.handler({ 
              ...params,
              context: context
            });
            return {
              success: true,
              data: result,
              message: 'Fleet jet information has been updated.'
            };
          } catch (error) {
            console.error('Error in updateFleetJet:', error);
            throw error;
          }
        },
        manageMembership: async (params: any) => {
          console.log('Calling manageMembership with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.manageMembership.handler({ 
              ...params,
              context: context
            });
            return {
              success: true,
              data: result,
              message: 'Membership has been updated.'
            };
          } catch (error) {
            console.error('Error in manageMembership:', error);
            throw error;
          }
        },
        sendNotification: async (params: any) => {
          console.log('Calling sendNotification with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.sendNotification.handler({ 
              ...params, 
              context: { 
                token: context.token,
                res: { locals: { token: context.token } }
              } 
            });
            return {
              success: true,
              data: result,
              message: 'Notification has been sent.'
            };
          } catch (error) {
            console.error('Error in sendNotification:', error);
            throw error;
          }
        },
        generateReport: async (params: any) => {
          console.log('Calling generateReport with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.generateReport.handler({ 
              ...params,
              context: context
            });
            return {
              success: true,
              data: result,
              message: 'Report has been generated.'
            };
          } catch (error) {
            console.error('Error in generateReport:', error);
            throw error;
          }
        }
      };

      // Add descriptions to admin tools
      wrappedTools.updateFleetJet.description = 'Update fleet jet information';
      wrappedTools.manageMembership.description = 'Manage user memberships';
      wrappedTools.sendNotification.description = 'Send notifications to users';
      wrappedTools.generateReport.description = 'Generate various reports';

      // Generate response using LLM with wrapped tools
      const response = await this.llm.generateWithTools(message, wrappedTools);
      
      if (response.error) {
        console.error('LLM returned an error:', response.error);
        return {
          success: false,
          error: response.error,
          code: 'LLM_ERROR',
          message: 'I encountered an error while processing your request.'
        };
      }

      // Parse LLM response and execute tool
      let toolCall: { tool?: string; params?: any } = {};
      try {
        toolCall = JSON.parse(response.text);
        if (!toolCall.tool) {
          return {
            success: false,
            error: 'No tool specified in response',
            code: 'INVALID_RESPONSE',
            message: 'I had trouble understanding your request.'
          };
        }
      } catch (e) {
        console.error('Failed to parse LLM response:', e);
        return {
          success: false,
          error: 'Invalid response from LLM',
          code: 'INVALID_RESPONSE',
          message: 'I had trouble understanding your request.'
        };
      }

      const { tool, params = {} } = toolCall;
      const toolHandler = wrappedTools[tool as keyof typeof wrappedTools];

      if (!toolHandler) {
        return {
          success: false,
          error: `Tool '${tool}' not found`,
          code: 'TOOL_NOT_FOUND',
          message: 'That action is not available.'
        };
      }

      try {
        const result = await toolHandler(params);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error executing tool ${tool}:`, error);
        return {
          success: false,
          error: errorMessage,
          code: 'TOOL_EXECUTION_ERROR',
          message: `I encountered an error while processing your request: ${errorMessage}`
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in AdminAssistant handleRequest:', error);
      return {
        success: false,
        error: errorMessage,
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.'
      };
    }
  }
}
