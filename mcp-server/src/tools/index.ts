import { searchJets } from './searchJets.js';
import { createBooking } from './createBooking.js';
import { getBookingStatus } from './getBookingStatus.js';
import { updateFleetJet } from './updateFleetJet.js';
import { manageMembership } from './manageMembership.js';
import { generateReport } from './generateReport.js';
import { sendNotification } from './sendNotification.js';

const tools = {
  searchJets,
  createBooking,
  getBookingStatus,
  updateFleetJet,
  manageMembership,
  generateReport,
  sendNotification
};

export async function executeTool(tool: string, params: any) {
  const toolInstance = tools[tool as keyof typeof tools];
  if (!toolInstance) {
    throw new Error(`Tool '${tool}' not found`);
  }
  return await toolInstance.handler(params);
}

export * from './searchJets.js';
export * from './createBooking.js';
export * from './getBookingStatus.js';
export * from './updateFleetJet.js';
export * from './manageMembership.js';
export * from './generateReport.js';
export * from './sendNotification.js'; 