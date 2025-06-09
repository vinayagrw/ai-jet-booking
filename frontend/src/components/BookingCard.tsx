import { Booking } from '@/types';
import { formatDate } from '@/utils/date';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Booking #{booking.id.slice(0, 8)}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Origin:</span>
          <span className="font-medium">{booking.origin}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Destination:</span>
          <span className="font-medium">{booking.destination}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Start Time:</span>
          <span className="font-medium">{formatDate(booking.start_time)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">End Time:</span>
          <span className="font-medium">{formatDate(booking.end_time)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Passengers:</span>
          <span className="font-medium">{booking.passengers}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Created: {formatDate(booking.created_at)}</span>
          <span>Updated: {formatDate(booking.updated_at)}</span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
          View Details
        </button>
        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300">
          Cancel
        </button>
      </div>
    </div>
  );
} 