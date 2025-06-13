import axios from 'axios';
import { authService } from './auth';

const MCP_URL = 'http://localhost:3000'; // Update with your MCP server URL

export interface SearchParams {
  departure: string;
  arrival: string;
  date: string;
  passengers: number;
}

export interface BookingData {
  jetId: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

class MCPService {
  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async searchJets(params: SearchParams) {
    const response = await axios.post(`${MCP_URL}/search`, params, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createBooking(data: BookingData) {
    const response = await axios.post(`${MCP_URL}/bookings`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getBookings() {
    const response = await axios.get(`${MCP_URL}/bookings`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async sendMessage(message: string) {
    const response = await axios.post(`${MCP_URL}/chat`, { message }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

export const mcpService = new MCPService(); 