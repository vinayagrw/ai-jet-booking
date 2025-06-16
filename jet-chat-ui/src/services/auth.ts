import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

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
}

export const authService = new AuthService(); 