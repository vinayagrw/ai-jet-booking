import Image from 'next/image';
import Link from 'next/link';
import { Jet } from '@/types';

interface JetCardProps {
  jet: Jet;
}

export default function JetCard({ jet }: JetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={jet.imageUrl || '/images/jet-placeholder.svg'}
          alt={jet.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{jet.name}</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Type:</span> {jet.type}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Capacity:</span> {jet.capacity} passengers
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Range:</span> {jet.range} nm
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Base Location:</span> {jet.baseLocation}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${jet.pricePerHour}/hour
          </span>
          <Link
            href={`/jets/${jet.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 