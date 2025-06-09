'use client';

import { useEffect, useState } from 'react';
import { Jet, SearchFilters as SearchFiltersType } from '@/types';
import { getJets, searchJets } from '@/services/jetService';
import JetCard from '@/components/JetCard';
import SearchFilters from '@/components/SearchFilters';

export default function JetsPage() {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJets();
  }, []);

  const loadJets = async () => {
    try {
      setLoading(true);
      const data = await getJets();
      setJets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jets. Please try again later.');
      console.error('Error loading jets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFiltersType) => {
    try {
      setLoading(true);
      const results = await searchJets(filters);
      setJets(results);
      setError(null);
    } catch (err) {
      setError('Failed to search jets. Please try again later.');
      console.error('Error searching jets:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Private Jets</h1>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : jets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jets.map((jet) => (
            <JetCard key={jet.id} jet={jet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 