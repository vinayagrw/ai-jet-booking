import React, { useState, useEffect } from 'react';
import { contactService } from '../services/contactService';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const info = await contactService.getPrimaryContactInfo();
      setContactInfo(info);
    } catch (err) {
      console.error('Error loading contact info:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await contactService.submitContactForm(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to submit message');
      console.error('Error submitting contact form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="contact-section">
      {contactInfo && (
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> {contactInfo.email}</p>
          <p><strong>Phone:</strong> {contactInfo.phone}</p>
          <p><strong>Address:</strong> {contactInfo.address}</p>
          <p><strong>Business Hours:</strong> {contactInfo.business_hours}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <h3>Send us a Message</h3>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">Message sent successfully!</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}; 