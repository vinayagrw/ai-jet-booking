'use client';

import { useState } from 'react';
import Link from 'next/link';

interface JetSpecification {
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

const jetSpecifications: Record<number, JetSpecification> = {
  1: {
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
  2: {
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
  // Add more jet specifications as needed
};

export default function JetDetailPage({ params }: { params: { id: string } }) {
  const jetId = parseInt(params.id);
  const jet = jetSpecifications[jetId];

  if (!jet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jet not found</h1>
          <Link
            href="/jets/categories"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
          >
            Return to Jet Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Jet Header */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="relative h-96 lg:h-full">
            <img
              src={jet.imageUrl}
              alt={`Jet ${jetId}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {jet.manufacturer} {jet.category}
            </h1>
            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-blue-600 dark:text-blue-400">
                {jet.price}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700 dark:text-gray-300">
                <p>
                  Experience luxury and performance with the {jet.manufacturer} {jet.category}. This
                  state-of-the-art aircraft combines comfort, efficiency, and advanced technology to
                  deliver an exceptional flying experience.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Range</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.range}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Max Speed
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.maxSpeed}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Takeoff Distance
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {jet.takeoffDistance}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Landing Distance
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {jet.landingDistance}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cabin</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Max Passengers
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {jet.maxPassengers}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cabin Height
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.cabinHeight}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cabin Width
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.cabinWidth}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cabin Length
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.cabinLength}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Baggage Capacity
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {jet.baggageCapacity}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Fuel Capacity
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.fuelCapacity}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.year}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{jet.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Jets */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Similar Jets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add similar jets here */}
          </div>
        </div>
      </div>
    </div>
  );
} 