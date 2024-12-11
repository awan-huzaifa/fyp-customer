import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestOptions {
  headers?: Record<string, string>;
  [key: string]: any;
}

class ApiService {
  static async getAuthToken() {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  static async post(endpoint: string, data: any, options: RequestOptions = {}) {
    try {
      const token = await this.getAuthToken();
      console.log('Making API request to:', `${API_CONFIG.BASE_URL}${endpoint}`);
      console.log('Request data:', data);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      };

      console.log('Request headers:', headers);

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        ...options
      });

      // Log response details
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(responseText);
        return {
          ok: response.ok,
          json: () => Promise.resolve(jsonData)
        };
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async get(endpoint: string, options: RequestOptions = {}) {
    try {
      const token = await this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
        ...options
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async delete(endpoint: string, options: RequestOptions = {}) {
    try {
      const token = await this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
        ...options
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async put(endpoint: string, data: any, options: RequestOptions = {}) {
    try {
      const token = await this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        ...options
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default ApiService; 