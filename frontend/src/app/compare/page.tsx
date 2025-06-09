'use client';

import { useState, useEffect } from 'react';

interface Aircraft {
  id: number;
  name: string;
  description: string;
  price_per_hour: number;
  max_passengers: number;
  range_km: number;
  category: {
    name: string;
  };
}

export default function ComparePage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        const response = await fetch('http://localhost:8000/aircraft');
        if (!response.ok) throw new Error('Failed to fetch aircraft');
        const data = await response.json();
        setAircraft(data);
      } catch (err) {
        setError('Failed to load aircraft');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAircraft();
  }, []);

  const handleSelectAircraft = (id: number) => {
    if (selectedAircraft.includes(id)) {
      setSelectedAircraft(selectedAircraft.filter(aircraftId => aircraftId !== id));
    } else if (selectedAircraft.length < 3) {
      setSelectedAircraft([...selectedAircraft, id]);
    }
  };

  const selectedAircraftDetails = aircraft.filter(jet => selectedAircraft.includes(jet.id));

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Compare Jets</h1>
      
      {/* Aircraft Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select up to 3 jets to compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aircraft.map((jet) => (
            <button
              key={jet.id}
              onClick={() => handleSelectAircraft(jet.id)}
              className={`p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                selectedAircraft.includes(jet.id)
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-medium">{jet.name}</h3>
              <p className="text-sm text-gray-500">{jet.category.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedAircraft.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specification
                </th>
                {selectedAircraftDetails.map((jet) => (
                  <th key={jet.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {jet.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Category
                </td>
                {selectedAircraftDetails.map((jet) => (
                  <td key={jet.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jet.category.name}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Price per Hour
                </td>
                {selectedAircraftDetails.map((jet) => (
                  <td key={jet.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${jet.price_per_hour.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Max Passengers
                </td>
                {selectedAircraftDetails.map((jet) => (
                  <td key={jet.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jet.max_passengers}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Range
                </td>
                {selectedAircraftDetails.map((jet) => (
                  <td key={jet.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jet.range_km.toLocaleString()} km
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 