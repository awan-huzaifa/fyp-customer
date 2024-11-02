import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
//import { styled } from 'nativewind';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    // Call API to send verification code
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl mb-5">Login</Text>
      <TextInput
        className="h-10 border border-gray-400 mb-5 px-2.5"
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity 
        className="bg-blue-600 py-2 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Send Verification Code</Text>
      </TouchableOpacity>
    </View>
  );
}