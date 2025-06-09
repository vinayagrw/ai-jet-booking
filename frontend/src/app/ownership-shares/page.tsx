'use client';

import React, { useState, useEffect } from 'react';

interface OwnershipShare {
  id: string;
  userId: string;
  jetId: string;
  percentage: number;
  purchaseDate: string;
  hoursAllocated: number;
  hoursRemaining: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * Renders the ownership shares page.
 * This component displays information about fractional ownership of private jets,
 * allowing users to view their shares and potentially purchase new ones. It includes client-side logging.
 * @returns {JSX.Element} The ownership shares page component.
 */
export default function OwnershipSharesPage() {
  const [ownershipShares, setOwnershipShares] = useState<OwnershipShare[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnershipShares = async () => {
      console.log('Attempting to fetch user ownership shares.');
      try {
        // In a real application, user ID would come from authentication context.
        // Assuming an endpoint to get shares for the authenticated user.
        const response = await fetch(`${API_URL}/api/ownership-shares`); 
        if (response.ok) {
          const data: OwnershipShare[] = await response.json();
          setOwnershipShares(data);
          console.log(`Successfully fetched ${data.length} ownership shares.`);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch ownership shares:', errorData.detail || response.statusText);
          setError(errorData.detail || 'Failed to load ownership shares');
        }
      } catch (err) {
        console.error('An unexpected error occurred while fetching ownership shares:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnershipShares();
  }, []);

  const handleExploreShares = () => {
    console.log('Explore New Shares button clicked.');
    // Implement navigation to a page for purchasing new shares
    alert('Explore New Shares functionality coming soon!');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading ownership shares...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Private Jet Ownership Shares</h1>
      <p className="text-lg text-gray-600 mb-8">Invest in fractional ownership of luxury private jets.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {ownershipShares.length === 0 ? (
          <p className="col-span-full text-center">You do not currently own any shares.</p>
        ) : (
          ownershipShares.map((share) => (
            <div key={share.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Jet ID: {share.jetId} ({share.percentage}% Share)</h3>
              <p className="text-gray-600">Purchase Date: <span className="font-medium text-gray-800">{new Date(share.purchaseDate).toLocaleDateString()}</span></p>
              <p className="text-gray-600">Allocated Hours: <span className="font-medium text-gray-800">{share.hoursAllocated}</span></p>
              <p className="text-gray-600 mb-4">Remaining Hours: <span className="font-medium text-gray-800">{share.hoursRemaining}</span></p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">View Details</button>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Purchase New Share</h2>
        <p className="text-gray-600 mb-4">Ready to expand your portfolio? Explore new fractional ownership opportunities.</p>
        <button onClick={handleExploreShares} className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">Explore Shares</button>
      </div>
    </div>
  );
} 