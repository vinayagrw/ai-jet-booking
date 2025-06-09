/**
 * @file frontend/src/app/admin/dashboard/page.tsx
 * @description This file defines the AdminDashboardPage component, which provides a central hub for administrators.
 * It is a protected page, accessible only by admin users, and offers navigation to various management sections (users, jets, bookings, memberships, ownership shares).
 * It includes client-side logging for page access and navigation clicks.
 */
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @function AdminDashboardPage
 * @description React functional component for the admin dashboard page.
 * Displays navigation links to different administration sections. Logs page load and navigation events.
 * @returns {JSX.Element} The admin dashboard UI.
 */
const AdminDashboardPage = () => {
  // Log when the component mounts (page loads).
  useEffect(() => {
    console.log('Admin Dashboard page loaded.');
  }, []);

  /**
   * @function handleNavLinkClick
   * @description Logs the navigation attempt when an admin dashboard link is clicked.
   * @param {string} path The path to which the user is navigating.
   */
  const handleNavLinkClick = (path: string) => {
    console.log(`Navigating to admin section: ${path}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Manage Jets Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Jets</h2>
          <ul className="space-y-2">
            <li><Link href="/admin/manage-jets" onClick={() => handleNavLinkClick('/admin/manage-jets')} className="text-blue-600 hover:underline">List All Jets</Link></li>
            <li><Link href="/admin/jets/add" onClick={() => handleNavLinkClick('/admin/jets/add')} className="text-blue-600 hover:underline">Add New Jet</Link></li>
            {/* Future: Add links for Update/Delete specific jet */}
          </ul>
        </div>

        {/* Manage Users Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          <ul className="space-y-2">
            <li><Link href="/admin/users" onClick={() => handleNavLinkClick('/admin/users')} className="text-blue-600 hover:underline">List All Users</Link></li>
            <li><Link href="/admin/users/add" onClick={() => handleNavLinkClick('/admin/users/add')} className="text-blue-600 hover:underline">Add New User</Link></li>
            {/* Future: Add links for Update/Delete specific user */}
          </ul>
        </div>

        {/* Manage Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
          <ul className="space-y-2">
            <li><Link href="/admin/manage-bookings" onClick={() => handleNavLinkClick('/admin/manage-bookings')} className="text-blue-600 hover:underline">List All Bookings</Link></li>
            {/* Future: Add links for Update/Delete specific booking */}
          </ul>
        </div>

        {/* Manage Memberships Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Memberships</h2>
          <ul className="space-y-2">
            <li><Link href="/admin/manage-memberships" onClick={() => handleNavLinkClick('/admin/manage-memberships')} className="text-blue-600 hover:underline">List All Memberships</Link></li>
            <li><Link href="/admin/memberships/add" onClick={() => handleNavLinkClick('/admin/memberships/add')} className="text-blue-600 hover:underline">Add New Membership Plan</Link></li>
          </ul>
        </div>

        {/* Manage Ownership Shares Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Ownership Shares</h2>
          <ul className="space-y-2">
            <li><Link href="/admin/manage-ownership-shares" onClick={() => handleNavLinkClick('/admin/manage-ownership-shares')} className="text-blue-600 hover:underline">List All Ownership Shares</Link></li>
            <li><Link href="/admin/ownership-shares/add" onClick={() => handleNavLinkClick('/admin/ownership-shares/add')} className="text-blue-600 hover:underline">Add New Ownership Share</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;