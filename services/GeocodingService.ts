import getEnvVars from '../config/env';

const env = getEnvVars();

interface GeocodingResult {
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

class GeocodingService {
  private static GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY;

  static async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      throw new Error('No address found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  static async getCoordinatesFromAddress(address: string): Promise<{latitude: number; longitude: number}> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      }
      throw new Error('No coordinates found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
}

export default GeocodingService; 