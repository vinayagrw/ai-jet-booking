import axios from 'axios';
import { logger } from '@/utils/logger';

const API_BASE_URL = 'http://localhost:8000/api/v1';

logger.info('API: Initializing with base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  logger.info('API: Making request to:', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    logger.info(`API Response [${response.config.method?.toUpperCase()}] ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    logger.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Contact API
export const contactApi = {
  getContactInfo: async () => {
    logger.info('API: Starting getContactInfo...');
    try {
      const response = await api.get('/contact');
      logger.info('API: getContactInfo response:', response);
      return response;
    } catch (error) {
      logger.error('API: getContactInfo error:', error);
      throw error;
    }
  },
  getPrimaryContactInfo: async () => {
    logger.info('API: Starting getPrimaryContactInfo...');
    try {
      const response = await api.get('/contact/primary');
      logger.info('API: getPrimaryContactInfo response:', response);
      return response;
    } catch (error) {
      logger.error('API: getPrimaryContactInfo error:', error);
      throw error;
    }
  },
};

// Jets API
export const jetsApi = {
  getJets: () => {
    logger.info('API: Fetching all jets...');
    return api.get('/jets')
      .then(response => {
        logger.info('API: Jets response:', response);
        return response;
      })
      .catch(error => {
        logger.error('API: Jets error:', error);
        throw error;
      });
  },
  getJetById: (id: string) => {
    logger.info('API: Fetching jet by ID:', id);
    return api.get(`/jets/${id}`)
      .then(response => {
        logger.info('API: Jet details response:', response);
        return response;
      })
      .catch(error => {
        logger.error('API: Jet details error:', error);
        throw error;
      });
  },
  getJetCategories: () => {
    logger.info('API: Fetching jet categories...');
    return api.get('/jets/categories')
      .then(response => {
        logger.info('API: Categories response:', response);
        return response;
      })
      .catch(error => {
        logger.error('API: Categories error:', error);
        throw error;
      });
  },
};

// Memberships API
export const membershipsApi = {
  getMemberships: () => api.get('/memberships'),
  getMembershipById: (id: string) => api.get(`/memberships/${id}`),
};

// Bookings API
export const bookingsApi = {
  getBookings: () => api.get('/bookings'),
  createBooking: (data: any) => api.post('/bookings', data),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
};

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Ownership Shares API
export const ownershipApi = {
  getShares: () => api.get('/ownership-shares'),
  getShareById: (id: string) => api.get(`/ownership-shares/${id}`),
};

export default api; 