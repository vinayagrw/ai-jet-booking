import { Jet, SearchFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function getJets(): Promise<Jet[]> {
  try {
    const response = await fetch(`${API_URL}/jets`);
    if (!response.ok) {
      throw new Error('Failed to fetch jets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching jets:', error);
    return [];
  }
}

export async function getJetById(id: string): Promise<Jet | null> {
  try {
    const response = await fetch(`${API_URL}/jets/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch jet');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching jet:', error);
    return null;
  }
}

export async function searchJets(filters: SearchFilters): Promise<Jet[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('min_price', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice.toString());
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.passengers) queryParams.append('passengers', filters.passengers.toString());
    if (filters.range) queryParams.append('range', filters.range.toString());

    const response = await fetch(`${API_URL}/jets/search?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search jets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching jets:', error);
    return [];
  }
} 