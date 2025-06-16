import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Configure axios to include the auth token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface UserInfo {
  email: string;
  name: string;
  id: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const responseData = response.data;
    
    if (responseData.access_token) {
      localStorage.setItem('token', responseData.access_token);
      
      // Create user info from the response data
      const userInfo: UserInfo = {
        id: responseData.user?.id || '',
        email: responseData.user?.email || credentials.email,
        name: responseData.user?.name || credentials.email.split('@')[0]
      };
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      return { ...responseData, user: userInfo };
    }

    throw new Error('No access token found in response');
  }

  async register(data: RegisterData): Promise<void> {
    await axios.post(`${API_URL}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserInfo(): UserInfo | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getCurrentUser(): Promise<UserInfo> {
    const response = await axios.get(`${API_URL}/users/me`);
    if (response.data) {
      const userInfo: UserInfo = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error('Failed to fetch user data');
  }
}

export const authService = new AuthService(); 