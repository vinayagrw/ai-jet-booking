import React, { useState, useEffect } from 'react';
import { Jet } from '../types';
import { createBooking } from '../services/bookingService';

interface BookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onCancel }) => {
  const [jets, setJets] = useState<Jet[]>([]);
  const [selectedJet, setSelectedJet] = useState<Jet | null>(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    start_time: '',
    end_time: '',
    passengers: 1,
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJets = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/jets/`);
        if (response.ok) {
          const data = await response.json();
          setJets(data);
        } else {
          setError('Failed to load available jets');
        }
      } catch (err) {
        setError('Failed to load available jets');
        console.error('Error loading jets:', err);
      }
    };

    fetchJets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJet) {
      setError('Please select a jet');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const booking = {
        ...formData,
        jet_id: selectedJet.id,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      };

      await createBooking(booking);
      onSuccess?.();
    } catch (err) {
      setError('Failed to create booking');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'jet_id') {
      const jet = jets.find(j => j.id === value);
      setSelectedJet(jet || null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book a Jet</h2>
      
      <div className="form-group">
        <label htmlFor="jet_id">Select Jet</label>
        <select
          id="jet_id"
          name="jet_id"
          value={selectedJet?.id || ''}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a jet</option>
          {jets.map((jet) => (
            <option key={jet.id} value={jet.id}>
              {jet.name} - {jet.manufacturer} (Max Passengers: {jet.max_passengers})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="origin">Origin</label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="start_time">Start Time</label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="end_time">End Time</label>
        <input
          type="datetime-local"
          id="end_time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="passengers">Number of Passengers</label>
        <input
          type="number"
          id="passengers"
          name="passengers"
          min="1"
          max={selectedJet?.max_passengers || 1}
          value={formData.passengers}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="special_requests">Special Requests</label>
        <textarea
          id="special_requests"
          name="special_requests"
          value={formData.special_requests}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="form-actions flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </div>
    </form>
  );
}; 