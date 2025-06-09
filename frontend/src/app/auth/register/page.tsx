/**
 * @file frontend/src/app/auth/register/page.tsx
 * @description This file defines the RegisterPage component, which provides a user interface for user registration.
 * It includes a form for entering email, password, and confirming password, handles form submission, and interacts with the backend API for user creation.
 * Upon successful registration, it redirects the user to the login page.
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // API URL for backend requests

/**
 * @function RegisterPage
 * @description React functional component for the user registration page.
 * Manages email, password, confirm password, and error states. Handles form submission for user registration.
 * @returns {JSX.Element} The registration page UI.
 */
const RegisterPage: React.FC = () => {
  // State variables for email, password, password confirmation, and any registration errors.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // useRouter hook to programmatically navigate between routes.
  const router = useRouter();

  /**
   * @async
   * @function handleSubmit
   * @description Handles the submission of the registration form.
   * Prevents default form submission, clears previous errors, validates password match, and sends a POST request to the backend /api/register endpoint.
   * On success, redirects to the login page. On failure, displays an error message.
   * @param {React.FormEvent} e The form event.
   * @returns {Promise<void>} A promise that resolves when the form submission is complete.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log(`Attempting registration for email: ${email}`);

    // Validate if passwords match.
    if (password !== confirmPassword) {
      console.warn('Registration failed: Passwords do not match.');
      setError('Passwords do not match');
      return;
    }

    try {
      // Send registration credentials to the backend API.
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the registration was successful.
      if (response.ok) {
        console.log('Registration successful. Redirecting to login page.');
        // Handle successful registration (e.g., show success message, redirect to login page).
        router.push('/auth/login');
      } else {
        // Parse error response from the backend and display it.
        const data = await response.json();
        console.error('Registration failed:', data.detail);
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      // Catch and display any unexpected network or other errors.
      console.error('An unexpected error occurred during registration:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 