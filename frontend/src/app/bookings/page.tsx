/**
 * @file frontend/src/app/bookings/page.tsx
 * @description This file defines the BookingsPage component, which displays a list of bookings for the authenticated user.
 * It fetches booking data from the backend and presents it in a user-friendly format.
 */
'use client';

import { useEffect, useState } from 'react';
import { Booking } from '@/types';
import { getBookings } from '@/services/bookingService';
import BookingCard from '@/components/BookingCard';
import { BookingForm } from '@/components/BookingForm';

/**
 * @function BookingsPage
 * @description React functional component for displaying the current user's bookings.
 * Fetches and displays a list of bookings associated with the authenticated user. Manages loading and error states during data fetching.
 * @returns {JSX.Element} The bookings page UI.
 */
export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Display loading message while data is being fetched.
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Display error message if data fetching failed.
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <button
          onClick={() => setShowBookingForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create New Booking
        </button>
      </div>

      {showBookingForm ? (
        <div className="mb-8">
          <BookingForm
            onSuccess={() => {
              setShowBookingForm(false);
              fetchBookings();
            }}
            onCancel={() => setShowBookingForm(false)}
          />
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't made any bookings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
} 