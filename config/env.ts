import { Platform } from 'react-native';

const ENV = {
  development: {
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  production: {
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

const getEnvVars = (env = process.env.NODE_ENV || 'development') => {
  if (env === 'development' || env === 'production') {
    return ENV[env];
  }
  return ENV.development;
};

export default getEnvVars; 