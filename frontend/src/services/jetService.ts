import api from './api';
import { Jet, JetCategory } from '../types';

// Get all jets
export const getJets = async (): Promise<Jet[]> => {
  const response = await api.get('/jets');
  return response.data;
};

// Get jet details
export const getJetDetails = async (jetId: string): Promise<Jet> => {
  const response = await api.get(`/jets/${jetId}`);
  return response.data;
};

// Search jets with filters
export const searchJets = async (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  passengers?: number;
  range?: number;
}): Promise<Jet[]> => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
  if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
  if (filters.location) params.append('location', filters.location);
  if (filters.passengers) params.append('passengers', filters.passengers.toString());
  if (filters.range) params.append('range', filters.range.toString());

  const response = await api.get(`/jets/search?${params.toString()}`);
  return response.data;
};

// Get all jet categories
export const getCategories = async (): Promise<JetCategory[]> => {
  const response = await api.get('/jets/categories');
  return response.data;
}; 