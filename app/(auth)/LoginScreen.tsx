import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Bypass authentication and directly navigate to home
    navigation.navigate('HomeScreen' as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FF" />
      <View style={{ flex: 1, padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ 
            fontSize: 28,
            fontWeight: 'bold',
            color: '#1E2243',
            marginBottom: 8
          }}>
            Welcome Back
          </Text>
          <Text style={{ 
            fontSize: 16,
            color: '#666B8F',
            lineHeight: 24
          }}>
            Sign in to continue providing services
          </Text>
        </View>

        {/* Login Form */}
        <View>
          {/* Phone Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 14,
              fontWeight: '600',
              color: '#1E2243',
              marginBottom: 8
            }}>Phone Number</Text>
            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E2E4ED',
              borderRadius: 12,
              backgroundColor: '#F8F9FF',
              paddingHorizontal: 16
            }}>
              <Ionicons name="call-outline" size={20} color="#666B8F" />
              <TextInput
                style={{ 
                  flex: 1,
                  height: 50,
                  marginLeft: 12,
                  fontSize: 16,
                  color: '#1E2243'
                }}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#A0A3BD"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ 
              fontSize: 14,
              fontWeight: '600',
              color: '#1E2243',
              marginBottom: 8
            }}>Password</Text>
            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E2E4ED',
              borderRadius: 12,
              backgroundColor: '#F8F9FF',
              paddingHorizontal: 16
            }}>
              <Ionicons name="lock-closed-outline" size={20} color="#666B8F" />
              <TextInput
                style={{ 
                  flex: 1,
                  height: 50,
                  marginLeft: 12,
                  fontSize: 16,
                  color: '#1E2243'
                }}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#A0A3BD"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={{ 
              backgroundColor: '#4E60FF',
              paddingVertical: 16,
              borderRadius: 12,
              shadowColor: '#4E60FF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5
            }}
            onPress={handleLogin}
          >
            <Text style={{ 
              color: '#FFFFFF',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '600'
            }}>Sign In</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={{ 
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 24
          }}>
            <Text style={{ color: '#666B8F' }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen' as never)}>
              <Text style={{ color: '#4E60FF', fontWeight: '600' }}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}