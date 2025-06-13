import type { Jet, Booking, Membership, Report, Notification } from './index.js';
import type { z } from 'zod';

export interface MCPRequest {
  tool: string;
  params: Record<string, unknown>;
}

export interface MCPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
}

export interface MCPTool<T = unknown> {
  name: string;
  description: string;
  parameters: z.ZodType;
  handler: (params: Record<string, unknown>) => Promise<MCPResponse<T>>;
}

export interface MCPServer {
  tools: {
    searchJets: MCPTool<Jet[]>;
    createBooking: MCPTool<Booking>;
    getBookingStatus: MCPTool<Booking>;
    updateFleetJet: MCPTool<Jet>;
    manageMembership: MCPTool<Membership>;
    generateReport: MCPTool<Report>;
    sendNotification: MCPTool<Notification>;
  };
  handleRequest: (request: MCPRequest) => Promise<MCPResponse>;
} 