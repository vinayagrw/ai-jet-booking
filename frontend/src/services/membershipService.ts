import { Membership } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function getMemberships(): Promise<Membership[]> {
  try {
    const response = await fetch(`${API_URL}/memberships`);
    if (!response.ok) {
      throw new Error('Failed to fetch memberships');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return [];
  }
}

export async function getMembershipById(id: string): Promise<Membership | null> {
  try {
    const response = await fetch(`${API_URL}/memberships/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch membership');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching membership:', error);
    return null;
  }
}

export async function purchaseMembership(membershipId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/memberships/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ membership_id: membershipId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error purchasing membership:', error);
    return false;
  }
} 