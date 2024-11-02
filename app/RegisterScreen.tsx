import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';



export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          navigation.navigate('WelcomeScreen'); // Navigate back to WelcomeScreen
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(location);
      } catch (error) {
        Alert.alert('Error', 'Location request failed. Please check your device settings.');
        navigation.navigate('WelcomeScreen'); // Navigate back to WelcomeScreen
      }
    };

    requestLocationPermission();
  }, [navigation]);

  const handleRegister = async() => {
    if (!name || !phoneNumber || !password || !confirmPassword || !location) {
      Alert.alert('Please fill all fields and allow location access');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters long');
      return;
    }
    if (!/\d/.test(password)) {
      Alert.alert('Password must contain at least one number');
      return;
    }
   // console.log('User registered:', { name, phoneNumber, password, location });
   try {
    // Call your backend API to send a verification code using Twilio
    const response = await fetch('https://40d5-2400-adc1-411-de00-00-2.ngrok-free.app/users/verify', { // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, name, password, location }),
    });

    if (response.ok) {
      navigation.navigate('VerificationScreen', { name, phoneNumber, password, location });
    } else {
      Alert.alert('Error', 'Failed to send verification code');
      if (password === confirmPassword) {
        console.log('password is correct');
        navigation.navigate('VerificationScreen', { name, phoneNumber, password, location });
      }
    }
  } catch (error) {
    //to check verification screen
    
    Alert.alert('Error', 'An error occurred while sending the verification code');
  }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* First 40% of the screen with an image */}
      <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Image
          source={require('../assets/images/register.png')} // Ensure you have an image in this path
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>

      {/* Remaining 60% of the screen with the existing form */}
      <View style={{ flex: 0.6, justifyContent: 'center', padding: 16, backgroundColor: '#FFFFFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Register</Text>
        <TextInput
          style={{ height: 64, borderColor: '#ccc', borderWidth: 1, borderRadius: 16, marginBottom: 16, paddingHorizontal: 16 }}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={{ height: 64, borderColor: '#ccc', borderWidth: 1, borderRadius: 16, marginBottom: 16, paddingHorizontal: 16 }}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
           <TextInput
          style={{ height: 64, borderColor: '#ccc', borderWidth: 1, borderRadius: 16, marginBottom: 16, paddingHorizontal: 16 }}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={{ height: 64, borderColor: '#ccc', borderWidth: 1, borderRadius: 16, marginBottom: 16, paddingHorizontal: 16 }}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity 
          style={{ backgroundColor: '#1E90FF', paddingVertical: 8, borderRadius: 16, marginBottom: 16 }}
          onPress={handleRegister}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Send Verification Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}