import { LocalLLMClient } from '../llm/localClient.js';
import { searchJets } from '../tools/searchJets.js';
import { createBooking } from '../tools/createBooking.js';
import { getBookingStatus } from '../tools/getBookingStatus.js';
import { updateFleetJet } from '../tools/updateFleetJet.js';
import { manageMembership } from '../tools/manageMembership.js';
import { generateReport } from '../tools/generateReport.js';
import { sendNotification } from '../tools/sendNotification.js';

const tools = {
  searchJets,
  createBooking,
  getBookingStatus,
  updateFleetJet,
  manageMembership,
  generateReport,
  sendNotification
};

export class AIConcierge {
  private llm: LocalLLMClient;

  constructor() {
    this.llm = new LocalLLMClient();
  }

  async handleRequest(message: string) {
    try {
      // Generate response using LLM
      const response = await this.llm.generateWithTools(message, {
        searchJets: tools.searchJets,
        createBooking: tools.createBooking,
        getBookingStatus: tools.getBookingStatus
      });

      if (response.error) {
        return {
          success: false,
          error: response.error
        };
      }

      // Parse LLM response and execute tool
      const { tool, params } = JSON.parse(response.text);
      const toolInstance = tools[tool as keyof typeof tools];

      if (!toolInstance) {
        return {
          success: false,
          error: `Tool ${tool} not found`
        };
      }

      const result = await toolInstance.handler(params);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export class AdminAssistant {
  private llm: LocalLLMClient;

  constructor() {
    this.llm = new LocalLLMClient();
  }

  async handleRequest(message: string) {
    try {
      // Generate response using LLM
      const response = await this.llm.generateWithTools(message, {
        updateFleetJet: tools.updateFleetJet,
        manageMembership: tools.manageMembership,
        generateReport: tools.generateReport
      });

      if (response.error) {
        return {
          success: false,
          error: response.error
        };
      }

      // Parse LLM response and execute tool
      const { tool, params } = JSON.parse(response.text);
      const toolInstance = tools[tool as keyof typeof tools];

      if (!toolInstance) {
        return {
          success: false,
          error: `Tool ${tool} not found`
        };
      }

      const result = await toolInstance.handler(params);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export class ReportingAgent {
  private llm: LocalLLMClient;

  constructor() {
    this.llm = new LocalLLMClient();
  }

  async handleRequest(message: string) {
    try {
      // Generate response using LLM
      const response = await this.llm.generateWithTools(message, {
        generateReport: tools.generateReport,
        sendNotification: tools.sendNotification
      });

      if (response.error) {
        return {
          success: false,
          error: response.error
        };
      }

      // Parse LLM response and execute tool
      const { tool, params } = JSON.parse(response.text);
      const toolInstance = tools[tool as keyof typeof tools];

      if (!toolInstance) {
        return {
          success: false,
          error: `Tool ${tool} not found`
        };
      }

      const result = await toolInstance.handler(params);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 