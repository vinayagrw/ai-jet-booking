/**
 * @file frontend/src/app/admin/manage-bookings/page.tsx
 * @description This file defines the ManageBookingsPage component, an administrative interface for viewing and managing jet bookings.
 * It fetches booking data from the backend and displays it in a list format.
 * This page is intended for administrators to oversee all bookings.
 */
'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @interface Booking
 * @description Defines the structure for a single booking object.
 * @property {number} id - The unique identifier for the booking.
 * @property {number} user_id - The ID of the user who made the booking.
 * @property {number} jet_id - The ID of the jet booked.
 * @property {string} start_time - The start timestamp of the booking.
 * @property {string} end_time - The end timestamp of the booking.
 * @property {string} status - The current status of the booking (e.g., 'pending', 'confirmed', 'completed', 'cancelled').
 * @property {number} total_price - The total price of the booking.
 */
interface Booking {
  id: number;
  user_id: number;
  jet_id: number;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
}

/**
 * @function ManageBookingsPage
 * @description React functional component for the admin page to manage bookings.
 * Fetches and displays a list of all bookings. Manages loading and error states during data fetching.
 * @returns {JSX.Element} The manage bookings page UI.
 */
const ManageBookingsPage: React.FC = () => {
  // State variables to store the list of bookings, loading status, and any error messages.
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * @effect
   * @description Fetches booking data from the backend API when the component mounts.
   * Sets loading state, handles successful data fetching, and catches errors.
   */
  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Admin: Attempting to fetch bookings.');
      try {
        // Fetch bookings from the admin API endpoint.
        const response = await fetch(`${API_URL}/api/admin/bookings`);
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
          console.log(`Admin: Successfully fetched ${data.length} bookings.`);
        } else {
          // Handle API errors and set the error message.
          const data = await response.json();
          console.error('Admin: Failed to fetch bookings:', data.detail || response.statusText);
          setError(data.detail || 'Failed to fetch bookings');
        }
      } catch (err) {
        // Handle unexpected errors during the fetch operation.
        console.error('Admin: An unexpected error occurred while fetching bookings:', err);
        setError('An unexpected error occurred');
      } finally {
        // Set loading to false once the fetch operation is complete, regardless of success or failure.
        setLoading(false);
      }
    };

    fetchBookings();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render.

  // Display loading message while data is being fetched.
  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  // Display error message if data fetching failed.
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">Booking #{booking.id}</h3>
                <p>User ID: {booking.user_id}</p>
                <p>Jet ID: {booking.jet_id}</p>
                <p>Status: {booking.status}</p>
                <p>Price: ${booking.total_price}</p>
                {/* Add edit/delete buttons here */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageBookingsPage; 