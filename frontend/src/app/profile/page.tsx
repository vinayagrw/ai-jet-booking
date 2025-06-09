'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface User {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  role: string;
  membership_id: string | null;
  created_at: string;
}

interface Booking {
  id: string;
  origin: string;
  destination: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('Fetching user data...');
        // Fetch user data
        const userResponse = await fetch(`${API_URL}/api/v1/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('User response status:', userResponse.status);
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.detail || 'Failed to fetch user data');
        }

        const userData = await userResponse.json();
        console.log('User data received:', userData);
        setUser(userData);

        // Fetch user's bookings
        console.log('Fetching bookings...');
        const bookingsResponse = await fetch(`${API_URL}/api/v1/bookings/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Bookings response status:', bookingsResponse.status);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          console.log('Bookings data received:', bookingsData);
          setBookings(bookingsData);
        } else {
          const errorData = await bookingsResponse.json();
          console.error('Error fetching bookings:', errorData);
        }
      } catch (err) {
        console.error('Error in fetchUserData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Loading profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">{error}</h2>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.name || `${user.first_name} ${user.last_name}`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Bookings</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.origin} → {booking.destination}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(booking.start_time).toLocaleDateString()} - {new Date(booking.end_time).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No bookings found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 