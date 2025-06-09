/**
 * @file frontend/src/app/admin/manage-ownership-shares/page.tsx
 * @description This file defines the ManageOwnershipSharesPage component, an administrative interface for viewing and managing jet ownership shares.
 * It fetches ownership share data from the backend and displays it in a list format.
 * This page is intended for administrators to oversee all ownership shares.
 */
'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @interface OwnershipShare
 * @description Defines the structure for a single ownership share object.
 * @property {number} id - The unique identifier for the ownership share.
 * @property {number} user_id - The ID of the user who owns the share.
 * @property {number} jet_id - The ID of the jet associated with the share.
 * @property {number} percentage - The percentage of ownership.
 * @property {string} purchase_date - The date when the ownership share was purchased.
 */
interface OwnershipShare {
  id: number;
  user_id: number;
  jet_id: number;
  percentage: number;
  purchase_date: string;
}

/**
 * @function ManageOwnershipSharesPage
 * @description React functional component for the admin page to manage ownership shares.
 * Fetches and displays a list of all ownership shares. Manages loading and error states during data fetching.
 * @returns {JSX.Element} The manage ownership shares page UI.
 */
const ManageOwnershipSharesPage: React.FC = () => {
  // State variables to store the list of ownership shares, loading status, and any error messages.
  const [ownershipShares, setOwnershipShares] = useState<OwnershipShare[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * @async
   * @function fetchOwnershipShares
   * @description Fetches ownership share data from the backend API.
   * Sets loading state, handles successful data fetching, and catches errors.
   * @returns {Promise<void>} A promise that resolves when the data fetching is complete.
   */
  useEffect(() => {
    const fetchOwnershipShares = async () => {
      console.log('Admin: Attempting to fetch ownership shares.');
      try {
        // Fetch ownership shares from the admin API endpoint.
        const response = await fetch(`${API_URL}/api/admin/ownership-shares`);
        if (response.ok) {
          const data = await response.json();
          setOwnershipShares(data);
          console.log(`Admin: Successfully fetched ${data.length} ownership shares.`);
        } else {
          // Handle API errors and set the error message.
          const data = await response.json();
          console.error('Admin: Failed to fetch ownership shares:', data.detail || response.statusText);
          setError(data.detail || 'Failed to fetch ownership shares');
        }
      } catch (err) {
        // Handle unexpected errors during the fetch operation.
        console.error('Admin: An unexpected error occurred while fetching ownership shares:', err);
        setError('An unexpected error occurred');
      } finally {
        // Set loading to false once the fetch operation is complete, regardless of success or failure.
        setLoading(false);
      }
    };

    fetchOwnershipShares();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render.

  // Display loading message while data is being fetched.
  if (loading) {
    return <div className="text-center py-8">Loading ownership shares...</div>;
  }

  // Display error message if data fetching failed.
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Ownership Shares</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Ownership Shares</h2>
        {ownershipShares.length === 0 ? (
          <p>No ownership shares available.</p>
        ) : (
          <ul className="space-y-4">
            {ownershipShares.map((share) => (
              <li key={share.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">Share #{share.id}</h3>
                <p>User ID: {share.user_id}</p>
                <p>Jet ID: {share.jet_id}</p>
                <p>Percentage: {share.percentage}%</p>
                <p>Purchase Date: {share.purchase_date}</p>
                {/* Add edit/delete buttons here */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageOwnershipSharesPage; 