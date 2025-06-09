'use client';

import { useEffect, useState } from 'react';
import { Membership } from '@/types';
import { getMemberships, enrollMembership } from '@/services/membershipService';

export default function MembershipPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await getMemberships();
        setMemberships(data);
      } catch (err) {
        setError('Failed to fetch memberships');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Membership Plans</h1>
      <ul>
        {memberships.map((membership) => (
          <li key={membership.id}>
            <h2>{membership.name}</h2>
            <p>{membership.description}</p>
            <button onClick={() => enrollMembership(membership.id, 'user_id')}>Enroll</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 