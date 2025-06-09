import React, { useEffect, useState } from 'react';
import { Membership } from '../types';
import { membershipService } from '../services/membershipService';

interface MembershipListProps {
  onMembershipSelect?: (membership: Membership) => void;
}

export const MembershipList: React.FC<MembershipListProps> = ({ onMembershipSelect }) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const data = await membershipService.getAllMemberships();
      setMemberships(data);
      setError(null);
    } catch (err) {
      setError('Failed to load memberships');
      console.error('Error loading memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="membership-list">
      <h2>Available Memberships</h2>
      <div className="memberships-grid">
        {memberships.map(membership => (
          <div key={membership.id} className="membership-card" onClick={() => onMembershipSelect?.(membership)}>
            <img src={membership.image_url || '/placeholder-membership.jpg'} alt={membership.name} />
            <h3>{membership.name}</h3>
            <p>{membership.description}</p>
            <p className="price">${membership.price}/month</p>
            <p>Duration: {membership.duration_months} months</p>
            <div className="benefits">
              <h4>Benefits:</h4>
              <ul>
                {membership.benefits?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => onMembershipSelect?.(membership)}>Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}; 