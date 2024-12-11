import React from 'react';
import { Stack } from 'expo-router';

interface RouteParams {
  serviceName?: string;
}

export default function ServicesLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#4E60FF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PlumberScreen" 
        options={{ 
          title: 'Plumbing Services',
        }} 
      />
      <Stack.Screen 
        name="ElectricianScreen" 
        options={{ 
          title: 'Electrical Services',
        }} 
      />
      <Stack.Screen 
        name="ACScreen" 
        options={{ 
          title: 'AC Services',
        }} 
      />
      <Stack.Screen 
        name="MechanicScreen" 
        options={{ 
          title: 'Mechanic Services',
        }} 
      />
      <Stack.Screen 
        name="PainterScreen" 
        options={{ 
          title: 'Painting Services',
        }} 
      />
      <Stack.Screen 
        name="CleaningScreen" 
        options={{ 
          title: 'Cleaning Services',
        }} 
      />
      <Stack.Screen 
        name="VendorListScreen" 
        options={({ route }) => ({ 
          title: (route.params as RouteParams)?.serviceName || 'Available Vendors',
        })} 
      />
      <Stack.Screen 
        name="OrderConfirmationScreen" 
        options={{ 
          title: 'Order Confirmation',
          headerBackVisible: false, // Prevent going back after confirmation
        }} 
      />
    </Stack>
  );
} 
// </```
// rewritten_file>