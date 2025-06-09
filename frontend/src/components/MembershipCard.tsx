import { Membership } from '@/types';

interface MembershipCardProps {
  membership: Membership;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{membership.name}</h3>
        <p className="text-gray-600">{membership.description}</p>
      </div>

      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-blue-600">${membership.price}</span>
        <span className="text-gray-600">/{membership.duration} months</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Up to {membership.maxBookings} bookings</span>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{membership.discount}% discount on all bookings</span>
        </div>
        {membership.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
        Select Plan
      </button>
    </div>
  );
} 