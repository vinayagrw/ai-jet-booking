'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log('Admin: Attempting to fetch users.');
      try {
        const response = await fetch('/api/admin/users'); // Assuming an admin API endpoint for users
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log(`Admin: Successfully fetched ${data.length} users.`);
        } else {
          const data = await response.json();
          console.error('Admin: Failed to fetch users:', data.detail || response.statusText);
          setError(data.detail || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Admin: An unexpected error occurred while fetching users:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Users</h2>
        {users.length === 0 ? (
          <p>No users available.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">{user.name} ({user.role})</h3>
                <p>Email: {user.email}</p>
                {/* Add edit/delete buttons here */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage; 