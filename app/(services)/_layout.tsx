import React from 'react';
import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlumberScreen" />
      <Stack.Screen name="ElectricianScreen" />
      <Stack.Screen name="ACScreen" />
      <Stack.Screen name="MechanicScreen" />
      <Stack.Screen name="PainterScreen" />
      <Stack.Screen name="CleaningScreen" />
    </Stack>
  );
} 