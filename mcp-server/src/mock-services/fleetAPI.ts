import type { Jet } from '../types/index.js';

// Mock jet data
const mockJets: Jet[] = [
  {
    id: 'jet1',
    name: 'Gulfstream G650',
    manufacturer: 'Gulfstream',
    model: 'G650',
    category_id: 'ultra-long-range',
    year: 2023,
    capacity: 19,
    price_per_hour: 12000,
    imageUrl: '/images/g650.jpg',
    amenities: ['WiFi', 'Satellite phone', 'Galley', 'Lavatory'],
    status: 'available',
    range: 7000,
    location: 'KJFK',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Add more mock jets as needed
];

interface SearchJetsParams {
  departure: string;
  arrival: string;
  date: string;
  jetSize?: 'ultra-long-range' | 'light' | 'midsize' | 'heavy';
  passengers?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

/**
 * Mock fleet API service for searching jets
 * @param params Search parameters
 * @returns Array of matching jets
 */
export async function searchJets(params: SearchJetsParams): Promise<Jet[]> {
  // Mock jet search results
  const jets: Jet[] = [
    {
      id: 'jet_1',
      name: 'Gulfstream G650',
      manufacturer: 'Gulfstream Aerospace',
      model: 'G650',
      category_id: 'ultra-long-range',
      year: 2023,
      capacity: 19,
      range: 7000,
      status: 'available',
      location: params.departure,
      price_per_hour: 12000,
      imageUrl: 'https://example.com/g650.jpg',
      amenities: ['WiFi', 'Conference Room', 'Bedroom'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'jet_2',
      name: 'Cessna Citation X',
      manufacturer: 'Cessna',
      model: 'Citation X',
      category_id: 'midsize',
      year: 2022,
      capacity: 12,
      range: 3500,
      status: 'available',
      location: params.departure,
      price_per_hour: 8000,
      imageUrl: 'https://example.com/citation-x.jpg',
      amenities: ['WiFi', 'Conference Room'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Filter jets based on criteria
  return jets.filter(jet => {
    if (params.jetSize && jet.category_id !== params.jetSize) return false;
    if (params.passengers && jet.capacity < params.passengers) return false;
    if (params.priceRange) {
      if (params.priceRange.min && jet.price_per_hour < params.priceRange.min) return false;
      if (params.priceRange.max && jet.price_per_hour > params.priceRange.max) return false;
    }
    return true;
  });
} 