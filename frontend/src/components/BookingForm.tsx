import React, { useState } from 'react';
import { Jet } from '../types';
import { bookingService } from '../services/bookingService';

interface BookingFormProps {
  jet: Jet;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ jet, onSuccess, onCancel }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const booking = {
        ...formData,
        jet_id: jet.id,
        user_id: localStorage.getItem('userId') || '', // This should come from your auth context
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      };

      await bookingService.createBooking(booking);
      onSuccess?.();
    } catch (err) {
      setError('Failed to create booking');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book {jet.name}</h2>
      
      <div className="form-group">
        <label htmlFor="origin">Origin</label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
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
        />
      </div>

      <div className="form-group">
        <label htmlFor="passengers">Number of Passengers</label>
        <input
          type="number"
          id="passengers"
          name="passengers"
          min="1"
          max={jet.max_passengers}
          value={formData.passengers}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="special_requests">Special Requests</label>
        <textarea
          id="special_requests"
          name="special_requests"
          value={formData.special_requests}
          onChange={handleChange}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </div>
    </form>
  );
}; 