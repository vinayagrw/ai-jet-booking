'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">AI Jet Booking</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/jets"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/jets') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Browse Jets
            </Link>
            <Link
              href="/memberships"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/memberships') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Memberships
            </Link>
            <Link
              href="/booking"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/booking') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/ownership-shares"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/ownership-shares') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Ownership
            </Link>
            <Link
              href="/admin"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/admin') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Admin
            </Link>
            <Link
              href="/about"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/about') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/contact') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/jets"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Browse Jets
          </Link>
          <Link
            href="/memberships"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Memberships
          </Link>
          <Link
            href="/booking"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Bookings
          </Link>
          <Link
            href="/ownership-shares"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Ownership
          </Link>
          <Link
            href="/admin"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
} 