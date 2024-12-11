import React, { useState, useEffect } from 'react';
import { ServiceScreen } from '../app/(services)/PlumberScreen';
import ApiService from '../services/ApiService';
import { Alert } from 'react-native';

export const createServiceScreen = (
  serviceName: string,
  categoryId: number,
  customStyles?: any
) => {
  const ServiceScreenWrapper = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadServices();
    }, []);

    const loadServices = async () => {
      try {
        const response = await ApiService.get(`/users/services?categoryId=${categoryId}`);
        const data = await response.json();
        if (data.success) {
          setServices(data.services);
        } else {
          Alert.alert('Error', 'Failed to load services');
        }
      } catch (error) {
        console.error('Error loading services:', error);
        Alert.alert('Error', 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    return (
      <ServiceScreen
        screenTitle={serviceName}
        services={services}
        customStyles={customStyles}
        isLoading={loading}
        categoryId={categoryId}
      />
    );
  };

  ServiceScreenWrapper.displayName = `${serviceName.replace(/\s+/g, '')}Screen`;
  
  return ServiceScreenWrapper;
}; 