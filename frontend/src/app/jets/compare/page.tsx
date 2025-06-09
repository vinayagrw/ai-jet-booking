'use client';

import { useState } from 'react';
import Link from 'next/link';

interface JetSpecification {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  year: number;
  range: string;
  maxSpeed: string;
  maxPassengers: number;
  price: string;
  cabinHeight: string;
  cabinWidth: string;
  cabinLength: string;
  baggageCapacity: string;
  takeoffDistance: string;
  landingDistance: string;
  fuelCapacity: string;
  imageUrl: string;
}

const jets: JetSpecification[] = [
  {
    id: 1,
    name: 'Cessna Citation CJ4',
    category: 'Light Jet',
    manufacturer: 'Cessna',
    year: 2023,
    range: '2,165 nm',
    maxSpeed: '528 mph',
    maxPassengers: 8,
    price: '$2,800/hour',
    cabinHeight: '4.8 ft',
    cabinWidth: '5.1 ft',
    cabinLength: '17.8 ft',
    baggageCapacity: '60 cu ft',
    takeoffDistance: '3,580 ft',
    landingDistance: '2,480 ft',
    fuelCapacity: '4,600 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=CJ4&backgroundColor=b6e3f4',
  },
  {
    id: 2,
    name: 'Embraer Phenom 300E',
    category: 'Light Jet',
    manufacturer: 'Embraer',
    year: 2023,
    range: '2,010 nm',
    maxSpeed: '528 mph',
    maxPassengers: 8,
    price: '$3,200/hour',
    cabinHeight: '4.9 ft',
    cabinWidth: '5.1 ft',
    cabinLength: '17.2 ft',
    baggageCapacity: '84 cu ft',
    takeoffDistance: '3,415 ft',
    landingDistance: '2,165 ft',
    fuelCapacity: '4,400 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Phenom300&backgroundColor=b6e3f4',
  },
  {
    id: 3,
    name: 'Hawker 800XP',
    category: 'Midsize Jet',
    manufacturer: 'Hawker Beechcraft',
    year: 2023,
    range: '2,800 nm',
    maxSpeed: '518 mph',
    maxPassengers: 9,
    price: '$4,500/hour',
    cabinHeight: '5.8 ft',
    cabinWidth: '5.7 ft',
    cabinLength: '23.0 ft',
    baggageCapacity: '90 cu ft',
    takeoffDistance: '5,140 ft',
    landingDistance: '2,950 ft',
    fuelCapacity: '7,200 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Hawker800&backgroundColor=b6e3f4',
  },
  {
    id: 4,
    name: 'Cessna Citation X',
    category: 'Midsize Jet',
    manufacturer: 'Cessna',
    year: 2023,
    range: '3,460 nm',
    maxSpeed: '717 mph',
    maxPassengers: 9,
    price: '$5,800/hour',
    cabinHeight: '5.7 ft',
    cabinWidth: '5.7 ft',
    cabinLength: '25.2 ft',
    baggageCapacity: '100 cu ft',
    takeoffDistance: '5,140 ft',
    landingDistance: '3,140 ft',
    fuelCapacity: '8,500 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=CitationX&backgroundColor=b6e3f4',
  },
  {
    id: 5,
    name: 'Gulfstream G280',
    category: 'Super Midsize Jet',
    manufacturer: 'Gulfstream',
    year: 2023,
    range: '3,600 nm',
    maxSpeed: '559 mph',
    maxPassengers: 10,
    price: '$7,200/hour',
    cabinHeight: '6.0 ft',
    cabinWidth: '6.2 ft',
    cabinLength: '26.0 ft',
    baggageCapacity: '120 cu ft',
    takeoffDistance: '5,200 ft',
    landingDistance: '3,000 ft',
    fuelCapacity: '9,000 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=G280&backgroundColor=b6e3f4',
  },
  {
    id: 6,
    name: 'Bombardier Challenger 350',
    category: 'Super Midsize Jet',
    manufacturer: 'Bombardier',
    year: 2023,
    range: '3,200 nm',
    maxSpeed: '528 mph',
    maxPassengers: 10,
    price: '$6,800/hour',
    cabinHeight: '6.2 ft',
    cabinWidth: '7.2 ft',
    cabinLength: '25.0 ft',
    baggageCapacity: '110 cu ft',
    takeoffDistance: '5,000 ft',
    landingDistance: '2,800 ft',
    fuelCapacity: '8,800 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Challenger350&backgroundColor=b6e3f4',
  },
  {
    id: 7,
    name: 'Gulfstream G650',
    category: 'Large Jet',
    manufacturer: 'Gulfstream',
    year: 2023,
    range: '7,000 nm',
    maxSpeed: '610 mph',
    maxPassengers: 16,
    price: '$11,000/hour',
    cabinHeight: '6.5 ft',
    cabinWidth: '8.6 ft',
    cabinLength: '46.8 ft',
    baggageCapacity: '195 cu ft',
    takeoffDistance: '6,000 ft',
    landingDistance: '3,000 ft',
    fuelCapacity: '18,000 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=G650&backgroundColor=b6e3f4',
  },
  {
    id: 8,
    name: 'Bombardier Global 7500',
    category: 'Large Jet',
    manufacturer: 'Bombardier',
    year: 2023,
    range: '7,700 nm',
    maxSpeed: '610 mph',
    maxPassengers: 16,
    price: '$12,000/hour',
    cabinHeight: '6.2 ft',
    cabinWidth: '8.2 ft',
    cabinLength: '43.3 ft',
    baggageCapacity: '195 cu ft',
    takeoffDistance: '6,000 ft',
    landingDistance: '3,000 ft',
    fuelCapacity: '18,000 lbs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Global7500&backgroundColor=b6e3f4',
  },
];

export default function ComparePage() {
  const [selectedJets, setSelectedJets] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleJetSelect = (jetId: number) => {
    if (selectedJets.includes(jetId)) {
      setSelectedJets(selectedJets.filter((id) => id !== jetId));
    } else if (selectedJets.length < 3) {
      setSelectedJets([...selectedJets, jetId]);
    }
  };

  const categories = ['all', ...new Set(jets.map((jet) => jet.category))];

  const filteredJets = jets
    .filter((jet) => {
      const matchesCategory = categoryFilter === 'all' || jet.category === categoryFilter;
      const matchesSearch = jet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jet.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
        case 'range':
          return parseInt(a.range.replace(/[^0-9]/g, '')) - parseInt(b.range.replace(/[^0-9]/g, ''));
        case 'passengers':
          return a.maxPassengers - b.maxPassengers;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const selectedJetDetails = jets.filter((jet) => selectedJets.includes(jet.id));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Compare Jets
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Select up to 3 jets to compare their specifications
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="range">Sort by Range</option>
              <option value="passengers">Sort by Passengers</option>
            </select>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jets..."
              className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Selected Jets Summary */}
        {selectedJets.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Selected Jets ({selectedJets.length}/3)
            </h3>
            <div className="flex flex-wrap gap-4">
              {selectedJetDetails.map((jet) => (
                <div
                  key={jet.id}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-2"
                >
                  <span className="text-sm text-gray-900 dark:text-white">{jet.name}</span>
                  <button
                    onClick={() => handleJetSelect(jet.id)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jet Selection */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJets.map((jet) => (
              <div
                key={jet.id}
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedJets.includes(jet.id)
                    ? 'ring-2 ring-blue-500'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => handleJetSelect(jet.id)}
              >
                <div className="relative h-48">
                  <img
                    src={jet.imageUrl}
                    alt={jet.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedJets.includes(jet.id) && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Selected
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {jet.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    {jet.manufacturer} • {jet.category}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                      {jet.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Range: {jet.range}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Max Passengers: {jet.maxPassengers}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedJets.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Specification
                    </th>
                    {selectedJetDetails.map((jet) => (
                      <th
                        key={jet.id}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {jet.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Category
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Range
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.range}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Max Speed
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.maxSpeed}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Max Passengers
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.maxPassengers}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Price
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.price}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Cabin Height
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.cabinHeight}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Cabin Width
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.cabinWidth}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Cabin Length
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.cabinLength}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Baggage Capacity
                    </td>
                    {selectedJetDetails.map((jet) => (
                      <td
                        key={jet.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                      >
                        {jet.baggageCapacity}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 