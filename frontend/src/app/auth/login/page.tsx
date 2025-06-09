/**
 * @file frontend/src/app/auth/login/page.tsx
 * @description This file defines the LoginPage component, which provides a user interface for logging into the application.
 * It includes a form for entering email and password, handles form submission, and interacts with the backend API for authentication.
 * Upon successful login, it redirects the user to the dashboard.
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @function LoginPage
 * @description React functional component for the user login page.
 * Manages email, password, and error states. Handles form submission for user authentication.
 * @returns {JSX.Element} The login page UI.
 */
const LoginPage: React.FC = () => {
  // State variables for email, password, and any authentication errors.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // useRouter hook to programmatically navigate between routes.
  const router = useRouter();

  /**
   * @async
   * @function handleSubmit
   * @description Handles the submission of the login form.
   * Prevents default form submission, clears previous errors, and sends a POST request to the backend /api/login endpoint.
   * On success, redirects to the dashboard. On failure, displays an error message.
   * @param {React.FormEvent} e The form event.
   * @returns {Promise<void>} A promise that resolves when the form submission is complete.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log(`Attempting login for email: ${email}`);

    try {
      // Send login credentials to the backend API.
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the login was successful.
      if (response.ok) {
        console.log('Login successful. Redirecting to dashboard.');
        // Handle successful login (e.g., store authentication token, redirect user).
        router.push('/dashboard'); // Redirect to a protected dashboard page after successful login.
      } else {
        // Parse error response from the backend and display it.
        const data = await response.json();
        console.error('Login failed:', data.detail);
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      // Catch and display any unexpected network or other errors.
      console.error('An unexpected error occurred during login:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 