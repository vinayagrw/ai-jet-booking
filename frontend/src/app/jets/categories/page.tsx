'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jetsApi } from '@/services/api';
import { logger } from '@/utils/logger';

// Add immediate logging
logger.info('=== JetCategoriesPage Module Loading ===');

// Force a log flush
if (typeof window === 'undefined') {
  process.stdout.write('');
}

interface JetCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Jet {
  id: string;
  name: string;
  manufacturer: string;
  category_id: string;
  year: number | null;
  max_speed_mph: number | null;
  max_passengers: number | null;
  price_per_hour: string | null;
  cabin_height_ft: number | null;
  cabin_width_ft: number | null;
  cabin_length_ft: number | null;
  baggage_capacity_cuft: number | null;
  takeoff_distance_ft: number | null;
  landing_distance_ft: number | null;
  fuel_capacity_lbs: number | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  features: string[] | null;
  amenities: string[] | null;
  status: string;
  range_nm: number;
  created_at: string;
  updated_at: string;
}

export default function JetCategoriesPage() {
  logger.info('=== JetCategoriesPage Component Rendering ===');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<JetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logger.info('=== useEffect Hook Triggered ===');
    
    const fetchCategories = async () => {
      logger.info('Starting to fetch categories...');
      try {
        logger.info('Calling jetsApi.getJetCategories()');
        const response = await jetsApi.getJetCategories();
        logger.info('API Response:', response);
        
        if (response.data) {
          // Remove duplicates based on name
          const uniqueCategories = response.data.reduce((acc: JetCategory[], current: JetCategory) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          
          logger.info('Setting unique categories:', uniqueCategories);
          setCategories(uniqueCategories);
        } else {
          logger.warn('No categories data received');
          setError('No categories available');
        }
      } catch (err) {
        logger.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  logger.debug('Current State:', { loading, error, categories });

  if (loading) {
    logger.info('Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading categories...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    logger.warn('Rendering error state:', error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</h2>
        </div>
      </div>
    );
  }

  logger.info('Rendering main content');
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Jet Categories
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Explore our comprehensive fleet of private jets
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mt-12">
          <nav className="flex flex-wrap justify-center gap-4" aria-label="Jet Categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Category Details */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${
                selectedCategory === null || selectedCategory === category.id ? 'block' : 'hidden'
              }`}
            >
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                {category.image_url && (
                  <div className="relative h-48 w-full">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                      {category.name}
                    </h2>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <Link
                    href={`/jets?category=${category.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Jets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 