'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Membership } from '@/types';
import { getMemberships, enrollMembership } from '@/services/membershipService';

export default function MembershipPage() {
  const { data: session } = useSession();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const data = await getMemberships();
      setMemberships(data);
      setError(null);
    } catch (err) {
      setError('Failed to load memberships. Please try again later.');
      console.error('Error fetching memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (membershipId: string) => {
    if (!session?.user?.id) {
      // Redirect to login if not authenticated
      window.location.href = '/login?callbackUrl=/membership';
      return;
    }

    try {
      setLoading(true);
      await enrollMembership(session.user.id, membershipId);
      setSelectedMembership(membershipId);
      setError(null);
    } catch (err) {
      setError('Failed to enroll in membership. Please try again later.');
      console.error('Error enrolling in membership:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Membership</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect membership tier for your private jet travel needs.
          Each tier comes with exclusive benefits and services.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{membership.name}</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold">${membership.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-4">{membership.description}</p>
              <ul className="space-y-4 mb-8">
                {membership.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(membership.id)}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
                  selectedMembership === membership.id
                    ? 'bg-green-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={loading}
              >
                {loading
                  ? 'Processing...'
                  : selectedMembership === membership.id
                  ? 'Subscribed'
                  : 'Subscribe Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMembership && (
        <div className="mt-8 text-center">
          <p className="text-green-600">
            Successfully subscribed to membership!
          </p>
        </div>
      )}
    </div>
  );
} 