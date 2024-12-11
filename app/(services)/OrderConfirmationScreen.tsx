import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import ApiService from '../../services/ApiService';

interface OrderDetails {
  id: string;
  status: string;
  price: string;
  createdAt: string;
  orderVendor: {
    id: string;
    user: {
      name: string;
      phone: string;
    };
    phoneForCalls: string;
  };
  orderService: {
    name: string;
    description: string;
  };
}

const OrderConfirmationScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await ApiService.get(`/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.order);
      } else {
        Alert.alert('Error', data.message || 'Failed to load order details');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrders = () => {
    router.push('/(tabs)/OrderTabScreen');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E60FF" />
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text>Order details not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="checkcircle" size={50} color="#4CAF50" />
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Your order has been successfully placed</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Service:</Text>
          <Text style={styles.value}>{orderDetails.orderService.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>Rs. {orderDetails.price}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{orderDetails.id}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vendor Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{orderDetails.orderVendor.user.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{orderDetails.orderVendor.phoneForCalls}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewOrders}>
        <Text style={styles.buttonText}>View My Orders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2243',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666B8F',
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2243',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666B8F',
  },
  value: {
    fontSize: 14,
    color: '#1E2243',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4E60FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmationScreen;