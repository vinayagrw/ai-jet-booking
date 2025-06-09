import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline block mb-2">
            Go to Dashboard
          </Link>
          <p className="text-gray-600">View and manage system overview, statistics, and quick actions.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Logs</h2>
          <Link href="/admin/logs" className="text-blue-600 hover:underline block mb-2">
            View Logs
          </Link>
          <p className="text-gray-600">Access and analyze system logs, errors, and activity records.</p>
        </div>
      </div>
    </div>
  );
} 