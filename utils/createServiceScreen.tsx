import React from 'react';
import { PlumberScreen } from '../app/(services)/PlumberScreen';
import { ServiceScreenProps } from '../types/screens';

export const createServiceScreen = (
  serviceName: string,
  services: any[],
  customStyles?: any
) => {
  function ServiceScreen() {
    return (
      <PlumberScreen
        screenTitle={serviceName}
        services={services}
        customStyles={customStyles}
      />
    );
  }

  // Set display name for debugging
  ServiceScreen.displayName = `${serviceName.replace(/\s+/g, '')}Screen`;
  
  return ServiceScreen;
}; 