import { searchJets } from '../tools/searchJets.js';
import { createBooking } from '../tools/createBooking.js';
import { getBookingStatus } from '../tools/getBookingStatus.js';
import { updateFleetJet } from '../tools/updateFleetJet.js';
import { manageMembership } from '../tools/manageMembership.js';
import { generateReport } from '../tools/generateReport.js';
import { sendNotification } from '../tools/sendNotification.js';
import { listUserBookings } from '../tools/listUserBookings.js';

// Define tool interface
export interface Tool {
  handler: (params: any & { context?: any }) => Promise<any>;
  context?: any;
  description: string;
  parameters?: Record<string, string>;
}

// Define the tools object with proper typing
export const tools: Record<string, Tool> = {
  searchJets: {
    ...searchJets,
    description: 'Search for available jets based on criteria',
    parameters: {
      departure: 'string | undefined',
      destination: 'string | undefined',
      date: 'string | undefined'
    }
  },
  createBooking: {
    ...createBooking,
    description: 'Create a new booking',
    parameters: {
      jetId: 'string',
      departure: 'string',
      destination: 'string',
      date: 'string'
    }
  },
  getBookingStatus: {
    ...getBookingStatus,
    description: 'Get status of a specific booking',
    parameters: {
      bookingId: 'string'
    }
  },
  updateFleetJet: {
    ...updateFleetJet,
    description: 'Update fleet jet information',
    parameters: {}
  },
  manageMembership: {
    ...manageMembership,
    description: 'Manage user membership',
    parameters: {}
  },
  generateReport: {
    ...generateReport,
    description: 'Generate reports',
    parameters: {}
  },
  sendNotification: {
    ...sendNotification,
    description: 'Send notifications',
    parameters: {}
  },
  listUserBookings: {
    ...listUserBookings,
    description: 'List all bookings for the current user',
    parameters: {}
  }
};
