import api from './api';
import { Membership } from '../types';

// Get all memberships
export const getMemberships = async (): Promise<Membership[]> => {
  const response = await api.get('/memberships');
  return response.data;
};

// Get membership details
export const getMembershipDetails = async (membershipId: string): Promise<Membership> => {
  const response = await api.get(`/memberships/${membershipId}`);
  return response.data;
};

// Enroll in a membership
export const enrollMembership = async (userId: string, membershipId: string): Promise<any> => {
  const response = await api.post('/memberships/enroll', { userId, membershipId });
  return response.data;
};

// Get user's current membership
export const getUserMembership = async (userId: string): Promise<Membership | null> => {
  const response = await api.get(`/memberships/users/${userId}/membership`);
  return response.data;
}; 