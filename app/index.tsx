import React from 'react';
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // Since we don't have backend yet, let's just redirect to SplashScreen
  return <Redirect href="/SplashScreen" />;

  /* Keep this commented code for when you implement backend
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (!token || !userData) {
        return <Redirect href="/SplashScreen" />;
      }

      const user = JSON.parse(userData);
      if (user.role === 'customer') {
        return <Redirect href="/(tabs)" />;
      }
      
      return <Redirect href="/SplashScreen" />;
    } catch (error) {
      return <Redirect href="/SplashScreen" />;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4E60FF" />
    </View>
  );
  */
} 