'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const membershipTiers = [
  {
    name: 'Basic',
    price: 0,
    features: [
      'Access to jet listings',
      'Basic search functionality',
      'Email support',
    ],
  },
  {
    name: 'Premium',
    price: 99,
    features: [
      'All Basic features',
      'Priority booking',
      '24/7 phone support',
      'Exclusive deals',
      'Free concierge service',
    ],
  },
  {
    name: 'Elite',
    price: 299,
    features: [
      'All Premium features',
      'Personal jet advisor',
      'VIP airport services',
      'Flexible cancellation',
      'Complimentary upgrades',
      'Private events access',
    ],
  },
];

export default function MembershipPage() {
  const { data: session } = useSession();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSubscribe = (tierName: string) => {
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = '/login?callbackUrl=/membership';
      return;
    }
    setSelectedTier(tierName);
    // TODO: Implement subscription logic
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Membership</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect membership tier for your private jet travel needs.
          Each tier comes with exclusive benefits and services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {membershipTiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{tier.name}</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
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
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(tier.name)}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
                  selectedTier === tier.name
                    ? 'bg-green-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {selectedTier === tier.name ? 'Subscribed' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTier && (
        <div className="mt-8 text-center">
          <p className="text-green-600">
            Successfully subscribed to {selectedTier} membership!
          </p>
        </div>
      )}
    </div>
  );
} 