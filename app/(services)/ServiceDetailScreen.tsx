import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import ApiService from '../../services/ApiService';

export default function ServiceDetailScreen({ route }) {
  const { serviceId } = route.params;
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await ApiService.get(`/orders/vendors?serviceId=${serviceId}`);
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (vendor) => {
    try {
      const response = await ApiService.post('/orders', {
        vendorId: vendor.id,
        serviceId,
        location: {
          // Get current location or selected address
        },
        description: 'Service request'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.requiresCall) {
          Alert.alert('Success', 'Request sent! Vendor will be notified via call.');
        } else {
          Alert.alert('Success', 'Request sent! Waiting for vendor response.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  // Render vendor list...
} 