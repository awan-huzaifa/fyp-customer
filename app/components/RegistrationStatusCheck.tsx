import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistrationStatusCheck() {
  const navigation = useNavigation();

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role === 'vendor' && user.vendor?.registrationStatus === 'incomplete') {
          navigation.navigate('CNICVerificationScreen' as never);
        }
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  return null;
} 