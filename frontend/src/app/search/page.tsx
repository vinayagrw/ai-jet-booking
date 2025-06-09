'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { jetsApi } from '@/services/api';

interface Jet {
  id: string;
  name: string;
  type: string;
  baseLocation: string;
  capacity: number;
  hourlyRate: number;
  available: boolean;
}

/**
 * Renders the search page for private jets.
 * This component allows users to input search criteria and displays matching jet results.
 * It includes client-side logging for search operations.
 * @returns {JSX.Element} The search page component.
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<string>(searchParams.get('origin') || '');
  const [destination, setDestination] = useState<string>(searchParams.get('destination') || '');
  const [date, setDate] = useState<string>(searchParams.get('date') || '');
  const [jets, setJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJets = async () => {
      console.log('Search Page: Starting to fetch jets with params:', {
        origin,
        destination,
        date
      });

      try {
        const response = await jetsApi.getJets();
        console.log('Search Page: API response received:', response);
        
        if (response.data) {
          // Filter jets based on search criteria
          const filteredJets = response.data.filter((jet: Jet) => {
            const matchesOrigin = !origin || jet.baseLocation.toLowerCase().includes(origin.toLowerCase());
            const matchesDestination = !destination || jet.baseLocation.toLowerCase().includes(destination.toLowerCase());
            // Add date filtering logic here if needed
            return matchesOrigin && matchesDestination;
          });
          
          console.log('Search Page: Filtered jets:', filteredJets);
          setJets(filteredJets);
        }
      } catch (err) {
        console.error('Search Page: Error fetching jets:', err);
        setError('Failed to load jets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJets();
  }, [origin, destination, date]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search Page: Form submitted with params:', {
      origin,
      destination,
      date
    });
    // The useEffect will handle the actual search
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Search for Private Jets</h1>
      <p className="text-lg text-gray-600 mb-8">Find your perfect private jet experience.</p>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="origin" className="block text-gray-700 text-sm font-bold mb-2">Origin:</label>
            <input
              type="text"
              id="origin"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">Destination:</label>
            <input
              type="text"
              id="destination"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
          <input
            type="date"
            id="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Search Jets
        </button>
      </form>

      {loading && <p className="text-center">Searching...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && jets.length > 0 && (
        <div className="w-full max-w-lg bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Available Jets</h2>
          <ul className="space-y-4">
            {jets.map((jet) => (
              <li key={jet.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">{jet.name} ({jet.type})</h3>
                <p>Location: {jet.baseLocation}</p>
                <p>Capacity: {jet.capacity}</p>
                <p>Hourly Rate: ${jet.hourlyRate}/hour</p>
                <p>Available: {jet.available ? 'Yes' : 'No'}</p>
                {/* Add a booking button or link here */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && jets.length === 0 && (
        <p>No jets found matching your criteria.</p>
      )}
    </div>
  );
} 