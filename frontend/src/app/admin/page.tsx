import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/admin/manage-bookings" className="text-blue-600 hover:underline">
            List of Bookings
          </Link>
        </li>
        {/* Add other admin links here */}
      </ul>
    </div>
  );
} 