/**
 * @file frontend/src/app/admin/manage-memberships/page.tsx
 * @description This file defines the ManageMembershipsPage component, an administrative interface for viewing and managing user memberships.
 * It fetches membership data from the backend and displays it in a list format.
 * This page is intended for administrators to oversee all memberships.
 */
'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @interface Membership
 * @description Defines the structure for a single membership object.
 * @property {number} id - The unique identifier for the membership.
 * @property {number} user_id - The ID of the user associated with the membership.
 * @property {string} membership_type - The type of membership (e.g., 'gold', 'silver', 'bronze').
 * @property {string} start_date - The start date of the membership.
 * @property {string} end_date - The end date of the membership.
 * @property {string} status - The current status of the membership (e.g., 'active', 'inactive', 'expired').
 */
interface Membership {
  id: number;
  user_id: number;
  membership_type: string;
  start_date: string;
  end_date: string;
  status: string;
}

/**
 * @function ManageMembershipsPage
 * @description React functional component for the admin page to manage memberships.
 * Fetches and displays a list of all memberships. Manages loading and error states during data fetching.
 * @returns {JSX.Element} The manage memberships page UI.
 */
const ManageMembershipsPage: React.FC = () => {
  // State variables to store the list of memberships, loading status, and any error messages.
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * @effect
   * @description Fetches membership data from the backend API when the component mounts.
   * Sets loading state, handles successful data fetching, and catches errors.
   */
  useEffect(() => {
    const fetchMemberships = async () => {
      console.log('Admin: Attempting to fetch memberships.');
      try {
        // Fetch memberships from the admin API endpoint.
        const response = await fetch(`${API_URL}/api/admin/memberships`);
        if (response.ok) {
          const data = await response.json();
          setMemberships(data);
          console.log(`Admin: Successfully fetched ${data.length} memberships.`);
        } else {
          // Handle API errors and set the error message.
          const data = await response.json();
          console.error('Admin: Failed to fetch memberships:', data.detail || response.statusText);
          setError(data.detail || 'Failed to fetch memberships');
        }
      } catch (err) {
        // Handle unexpected errors during the fetch operation.
        console.error('Admin: An unexpected error occurred while fetching memberships:', err);
        setError('An unexpected error occurred');
      } finally {
        // Set loading to false once the fetch operation is complete, regardless of success or failure.
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render.

  // Display loading message while data is being fetched.
  if (loading) {
    return <div className="text-center py-8">Loading memberships...</div>;
  }

  // Display error message if data fetching failed.
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Memberships</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Memberships</h2>
        {memberships.length === 0 ? (
          <p>No memberships available.</p>
        ) : (
          <ul className="space-y-4">
            {memberships.map((membership) => (
              <li key={membership.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">Membership #{membership.id}</h3>
                <p>User ID: {membership.user_id}</p>
                <p>Type: {membership.membership_type}</p>
                <p>Status: {membership.status}</p>
                {/* Add edit/delete buttons here */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageMembershipsPage; 