import Image from 'next/image';
import Link from 'next/link';

interface JetCardProps {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  imageUrl: string;
  price: number;
  capacity: number;
  range: number;
}

export default function JetCard({
  id,
  name,
  model,
  manufacturer,
  imageUrl,
  price = 0,
  capacity = 0,
  range = 0,
}: JetCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || '/images/jet-placeholder.jpg'}
          alt={name || 'Private Jet'}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name || 'Unnamed Jet'}</h3>
            <p className="text-sm text-gray-500">
              {manufacturer || 'Unknown'} {model || 'Unknown Model'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              ${(price || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per hour</div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm text-gray-600">
              {(capacity || 0).toLocaleString()} passengers
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm text-gray-600">
              {(range || 0).toLocaleString()} nm
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/jets/${id}`}>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-900 transition-all shadow-sm hover:shadow-md">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
} 