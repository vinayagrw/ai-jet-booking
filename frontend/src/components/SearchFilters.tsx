'use client';

import { useState } from 'react';
import { SearchFilters as SearchFiltersType } from '@/types';

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersType) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFiltersType>({
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    passengers: undefined,
    range: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            suppressHydrationWarning
          >
            <option value="">All Categories</option>
            <option value="light">Light Jets</option>
            <option value="midsize">Midsize Jets</option>
            <option value="heavy">Heavy Jets</option>
            <option value="ultra-long-range">Ultra Long Range</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            suppressHydrationWarning
          />
        </div>

        <div>
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
            Passengers
          </label>
          <input
            type="number"
            id="passengers"
            name="passengers"
            value={filters.passengers}
            onChange={handleChange}
            placeholder="Number of passengers"
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            suppressHydrationWarning
          />
        </div>

        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            Min Price per Hour
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Minimum price"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            suppressHydrationWarning
          />
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            Max Price per Hour
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Maximum price"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            suppressHydrationWarning
          />
        </div>

        <div>
          <label htmlFor="range" className="block text-sm font-medium text-gray-700">
            Minimum Range (nm)
          </label>
          <input
            type="number"
            id="range"
            name="range"
            value={filters.range}
            onChange={handleChange}
            placeholder="Minimum range"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            suppressHydrationWarning
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search Jets
        </button>
      </div>
    </form>
  );
} 