'use client';

import React, { useState, useEffect } from 'react';

interface BookingDetails {
  jetId: string;
  startTime: string;
  endTime: string;
  origin: string;
  destination: string;
  userId?: string; // This would typically come from authentication context
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * Renders the booking page for private jets.
 * This component allows users to review booking details and confirm their reservation.
 * It interacts with backend APIs to finalize bookings and includes client-side logging.
 * @returns {JSX.Element} The booking page component.
 */
export default function BookingPage() {
  const [jetId, setJetId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // In a real application, you might get jetId from query params or context
  // For now, let's assume a dummy jetId for demonstration.
  useEffect(() => {
    // Example: get jetId from URL if navigated from search results
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('jetId');
    if (id) {
      setJetId(id);
    }
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log(`Attempting to book jet ${jetId} from ${origin} to ${destination} for time: ${startTime} to ${endTime}`);

    const bookingData: BookingDetails = {
      jetId,
      startTime,
      endTime,
      origin,
      destination,
      // userId: 'some-authenticated-user-id', // In a real app, get this from auth context
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourAuthToken}` // Include auth token if available
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Booking successful:', data);
        setSuccess(`Booking ${data.id} confirmed!`);
        // Clear form or redirect
        setOrigin('');
        setDestination('');
        setStartTime('');
        setEndTime('');
        setJetId('');
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData.detail || response.statusText);
        setError(errorData.detail || 'Failed to create booking');
      }
    } catch (err) {
      console.error('An unexpected error occurred during booking:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Confirm Your Booking</h1>
      <p className="text-lg text-gray-600 mb-8">Review your flight details and complete your reservation.</p>

      <form onSubmit={handleBooking} className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-8">
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

        <div className="mb-4">
          <label htmlFor="jetId" className="block text-gray-700 text-sm font-bold mb-2">Jet ID:</label>
          <input
            type="text"
            id="jetId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
            value={jetId}
            readOnly
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="origin" className="block text-gray-700 text-sm font-bold mb-2">Origin:</label>
            <input
              type="text"
              id="origin"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
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
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
            <input
              type="datetime-local"
              id="startTime"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">End Time:</label>
            <input
              type="datetime-local"
              id="endTime"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
} 