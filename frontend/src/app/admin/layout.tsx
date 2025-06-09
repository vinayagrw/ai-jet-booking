import React from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
} 