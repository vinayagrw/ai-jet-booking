import api from './api';
import { Membership } from '../types';

export const membershipService = {
  // Get all memberships
  getAllMemberships: async (): Promise<Membership[]> => {
    const response = await api.get('/memberships');
    return response.data;
  },

  // Get membership details
  getMembershipDetails: async (membershipId: string): Promise<Membership> => {
    const response = await api.get(`/memberships/${membershipId}`);
    return response.data;
  },

  // Enroll in a membership
  enrollMembership: async (userId: string, membershipId: string): Promise<any> => {
    const response = await api.post('/memberships/enroll', { userId, membershipId });
    return response.data;
  },

  // Get user's current membership
  getUserMembership: async (userId: string): Promise<Membership | null> => {
    const response = await api.get(`/memberships/users/${userId}/membership`);
    return response.data;
  }
}; 