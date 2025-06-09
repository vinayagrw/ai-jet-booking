/**
 * @file frontend/src/app/admin/manage-jets/page.tsx
 * @description This file defines the ManageJetsPage component, which provides an administrative interface for viewing and managing private jets.
 * It fetches jet data from the backend and displays it in a list format. This page is intended for administrators to oversee jet listings.
 * It includes client-side logging for data fetching operations.
 */
'use client';

import React, { useState, useEffect } from 'react';

interface Jet {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
  hourly_rate: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @function ManageJetsPage
 * @description React functional component for the admin page to manage jets.
 * Fetches and displays a list of all jets. Manages loading and error states during data fetching.
 * Includes client-side logging for fetch operations.
 * @returns {JSX.Element} The manage jets page UI.
 */
const ManageJetsPage: React.FC = () => {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJets = async () => {
      console.log('Admin: Attempting to fetch jets.');
      try {
        const response = await fetch(`${API_URL}/api/admin/jets`);
        if (response.ok) {
          const data = await response.json();
          setJets(data);
          console.log(`Admin: Successfully fetched ${data.length} jets.`);
        } else {
          const data = await response.json();
          console.error('Admin: Failed to fetch jets:', data.detail || response.statusText);
          setError(data.detail || 'Failed to fetch jets');
        }
      } catch (err) {
        console.error('Admin: An unexpected error occurred while fetching jets:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJets();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading jets...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Jets</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Jets</h2>
        {jets.length === 0 ? (
          <p>No jets available.</p>
        ) : (
          <ul className="space-y-4">
            {jets.map((jet) => (
              <li key={jet.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">{jet.name} ({jet.type})</h3>
                <p>Capacity: {jet.capacity}</p>
                <p>Location: {jet.location}</p>
                <p>Hourly Rate: ${jet.hourly_rate}/hour</p>
                {/* Add edit/delete buttons here */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageJetsPage; 