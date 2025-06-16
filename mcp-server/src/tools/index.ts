import { searchJets } from './searchJets.js';
import { createBooking } from './createBooking.js';
import { getBookingStatus } from './getBookingStatus.js';
import { updateFleetJet } from './updateFleetJet.js';
import { manageMembership } from './manageMembership.js';
import { generateReport } from './generateReport.js';
import { sendNotification } from './sendNotification.js';
import { listUserBookings } from './listUserBookings.js';

export interface ToolHandlerContext {
  token?: string;
  res?: {
    locals?: {
      token?: string;
    };
  };
}

// Tool handler function that receives params with context included
// This matches the actual implementation where context is passed as part of params
export type ToolHandler<T = any> = (params: any & { context?: ToolHandlerContext }) => Promise<T>;

const tools = {
  searchJets,
  createBooking,
  getBookingStatus,
  updateFleetJet,
  manageMembership,
  generateReport,
  sendNotification,
  listUserBookings
};

export async function executeTool(tool: string, params: any, context: ToolHandlerContext = {}) {
  const toolHandler = tools[tool as keyof typeof tools];
  if (!toolHandler) {
    throw new Error(`Tool ${tool} not found`);
  }
  
  // Ensure we have a token in the context
  if (!context.token && context.res?.locals?.token) {
    context.token = context.res.locals.token;
  }
  
  if (!context.token) {
    throw new Error('No authentication token provided');
  }
  
  // Call the handler with params and context merged
  return toolHandler.handler({
    ...params,
    context
  });
}

export * from './searchJets.js';
export * from './createBooking.js';
export * from './getBookingStatus.js';
export * from './updateFleetJet.js';
export * from './manageMembership.js';
export * from './generateReport.js';
export * from './sendNotification.js';
export * from './listUserBookings.js';