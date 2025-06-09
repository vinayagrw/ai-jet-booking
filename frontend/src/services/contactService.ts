import api from './api';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  business_hours: string;
}

export const contactService = {
  // Get primary contact information
  getPrimaryContactInfo: async (): Promise<ContactInfo> => {
    const response = await api.get('/contact/primary');
    return response.data;
  },

  // Submit contact form
  submitContactForm: async (message: ContactMessage): Promise<{ message: string }> => {
    const response = await api.post('/contact', message);
    return response.data;
  }
}; 