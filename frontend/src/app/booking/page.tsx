 'use client';

import React, { useState, useEffect } from 'react';

interface Jet {
  id: string;
  name: string;
  type: string;
  baseLocation: string;
  capacity: number;
  hourlyRate: number;
}

interface BookingDetails {
  user_id: string;
  jet_id: string;
  origin: string;
  destination: string;
  start_time: string;
  end_time: string;
  passengers: number;
  special_requests?: string;
}

interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Function to generate a random UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

export default function BookingPage() {
  const [jets, setJets] = useState<Jet[]>([]);
  const [jetId, setJetId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch available jets
  useEffect(() => {
    const fetchJets = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/jets/`);
        if (response.ok) {
          const data = await response.json();
          setJets(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch jets:', errorData);
          setError('Failed to load available jets. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching jets:', err);
        setError('Failed to load available jets. Please try again later.');
      }
    };

    fetchJets();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!jetId) {
      setError('Please select a jet first');
      setLoading(false);
      return;
    }

    const bookingData: BookingDetails = {
      user_id: generateUUID(), // Generate a random UUID for each booking
      jet_id: jetId,
      origin: origin,
      destination: destination,
      start_time: startTime,
      end_time: endTime,
      passengers: passengers,
      special_requests: specialRequests || undefined
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/bookings/`, {
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
        // Clear form
        setOrigin('');
        setDestination('');
        setStartTime('');
        setEndTime('');
        setJetId('');
        setPassengers(1);
        setSpecialRequests('');
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData);
        
        // Handle different types of error responses
        if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else if (Array.isArray(errorData.detail)) {
          // Handle validation errors
          const errorMessages = errorData.detail
            .map((err: ValidationError) => `${err.loc[err.loc.length - 1]}: ${err.msg}`)
            .join(', ');
          setError(errorMessages);
        } else {
          setError('Failed to create booking. Please try again.');
        }
      }
    } catch (err) {
      console.error('An unexpected error occurred during booking:', err);
      setError('An unexpected error occurred. Please try again.');
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
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="jetId" className="block text-gray-700 text-sm font-bold mb-2">Select Jet:</label>
          <select
            id="jetId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={jetId}
            onChange={(e) => setJetId(e.target.value)}
            required
          >
            <option value="">Select a jet</option>
            {jets.map((jet) => (
              <option key={jet.id} value={jet.id}>
                {jet.name} - {jet.type} (${jet.hourlyRate}/hour)
              </option>
            ))}
          </select>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <div className="mb-4">
          <label htmlFor="passengers" className="block text-gray-700 text-sm font-bold mb-2">Number of Passengers:</label>
          <input
            type="number"
            id="passengers"
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="specialRequests" className="block text-gray-700 text-sm font-bold mb-2">Special Requests:</label>
          <textarea
            id="specialRequests"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
          />
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