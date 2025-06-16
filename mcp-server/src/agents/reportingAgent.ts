import { LocalLLMClient } from '../llm/localClient.js';
import { ToolHandlerContext } from '../tools/index.js';
import { tools } from './tools.js';

/**
 * ReportingAgent handles report generation and analysis
 * It provides tools for generating various types of reports
 * and analyzing booking and flight data
 */
export class ReportingAgent {
  private llm: LocalLLMClient;

  // Define the response type for our wrapped tools
  private ToolResponse = {
    success: true,
    data: null as any,
    message: ''
  };

  // Define the ToolHandler type that matches our tool handler signatures
  private ToolHandler = (params: any) => Promise<{
    success: boolean;
    data: any;
    message: string;
    metadata?: Record<string, any>;
  }>;

  constructor() {
    this.llm = new LocalLLMClient();
  }

  /**
   * Handle incoming report generation requests
   * @param message The user's message/request
   * @param req The request object containing authentication and other metadata
   * @returns A response with the generated report or an error
   */
  async handleRequest(message: string, req?: any) {
    try {
      // Extract token from request
      const token = req?.token || req?.body?.token || (req?.headers?.authorization?.split(' ')[1]);
      
      if (!token) {
        console.error('No authentication token found in request');
        return {
          success: false,
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
          message: 'Please log in to access reporting features.'
        };
      }

      // Create context with token for downstream API calls
      const context: ToolHandlerContext = { 
        token,
        res: { 
          locals: { token } 
        }
      };

      console.log('ReportingAgent created context with token:', context.token ? 'Token exists' : 'No token in context');

      // Define available reporting tools
      const wrappedTools: Record<string, this['ToolHandler']> = {
        generateReport: async (params: any) => {
          console.log('Calling generateReport with params:', JSON.stringify(params, null, 2));
          try {
            const result = await tools.generateReport.handler({ ...params, context });
            console.log('generateReport result:', JSON.stringify(result, null, 2));
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

      // Add descriptions to tools for the LLM
      (wrappedTools.generateReport as any).description = 'Generate various reports';

      console.log('\n=== SENDING TO LLM ===');
      console.log('User message:', message);
      console.log('Available tools:', Object.keys(wrappedTools));

      // Generate response using LLM with wrapped tools
      const response = await this.llm.generateWithTools(message, wrappedTools as any);
      
      console.log('\n=== LLM RESPONSE ===');
      console.log('Raw response:', JSON.stringify(response, null, 2));
      
      if (response.error) {
        console.error('LLM returned an error:', response.error);
        return {
          success: false,
          error: response.error,
          code: 'LLM_ERROR',
          message: 'An error occurred while processing your report request.'
        };
      }

      // Parse and validate the LLM response
      let toolCall: { tool?: string; params?: any } = {};
      try {
        console.log('\n=== PARSING LLM RESPONSE ===');
        toolCall = JSON.parse(response.text);
        console.log('Parsed tool call:', JSON.stringify(toolCall, null, 2));
        
        if (!toolCall.tool) {
          console.warn('No tool specified in LLM response');
          return {
            success: false,
            message: 'I had trouble understanding your report request. Could you please provide more details?',
            error: 'No tool specified in LLM response',
            code: 'INVALID_REQUEST'
          };
        }
        
        console.log(`Selected tool: ${toolCall.tool}`);
      } catch (e) {
        console.error('Failed to parse LLM response:', e);
        console.error('Raw response text:', response.text);
        return {
          success: false,
          error: 'Failed to parse tool call from LLM',
          details: response.text,
          code: 'INVALID_TOOL_CALL',
          message: 'I had trouble processing your report request. Please try again.'
        };
      }

      // Execute the selected tool
      const { tool, params } = toolCall;
      const toolHandler = wrappedTools[tool as keyof typeof wrappedTools];

      if (!toolHandler) {
        return {
          success: false,
          error: `Tool ${tool} not found`,
          code: 'TOOL_NOT_FOUND',
          message: 'The requested report type is not available.'
        };
      }

      try {
        console.log(`Executing tool: ${tool} with params:`, JSON.stringify(params, null, 2));
        const result = await toolHandler(params || {});
        
        // Format the response with a user-friendly message
        const response = {
          success: true,
          message: result?.message || 'Report generated successfully',
          data: result?.data || result,
          metadata: result?.metadata || {}
        };

        console.log(`Tool ${tool} execution result:`, JSON.stringify(response, null, 2));
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error executing tool ${tool}:`, error);
        return {
          success: false,
          error: errorMessage,
          code: 'TOOL_EXECUTION_ERROR',
          message: `I encountered an error while generating your report: ${errorMessage}`
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in handleRequest:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing your report. Please try again later.',
        details: error instanceof Error ? error.stack : undefined
      };
    }
  }
}
