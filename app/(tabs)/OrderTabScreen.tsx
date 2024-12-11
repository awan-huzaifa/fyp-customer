import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Animated, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ApiService from '../../services/ApiService';

interface Order {
  id: string;
  status: string;
  vendor: {
    id: string;
    name: string;
    phoneForCalls: string;
  };
  service: {
    name: string;
  };
  price: number;
  createdAt: string;
  location: {
    address: string;
  };
}

export default function OrderTabScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ApiService.get('/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'accepted' || order.status === 'in_progress'
  );

  const completedOrders = orders.filter(order => 
    order.status === 'completed'
  );

  const renderOrderCard = (order: Order) => {
    const isActive = order.status !== 'completed';
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <Animated.View style={[styles.orderCard, { opacity: fadeAnim }]}>
        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(order.status).bgColor }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(order.status).textColor }
          ]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>

        {/* Service Provider Info */}
        <View style={styles.providerSection}>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{order.vendor.name}</Text>
            <Text style={styles.serviceType}>{order.service.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.price}>Rs. {order.price}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666B8F" />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666B8F" />
            <Text style={styles.detailText}>{order.location.address}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isActive ? (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleContact(order)}
              >
                <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Contact Provider</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => handleCancel(order)}
              >
                <Ionicons name="close-circle-outline" size={20} color="#FF4E4E" />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Cancel Order
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleRebook(order)}
              >
                <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Book Again</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => handleReview(order)}
              >
                <Ionicons name="star-outline" size={20} color="#4E60FF" />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Write Review
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  const handleContact = (order: Order) => {
    // Implement contact functionality
    const phoneNumber = order.vendor.phoneForCalls;
    Alert.alert(
      'Contact Provider',
      `Call ${order.vendor.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Call',
          onPress: () => {
            // Use Linking to make a phone call
            Linking.openURL(`tel:${phoneNumber}`);
          }
        }
      ]
    );
  };

  const handleCancel = (order: Order) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await ApiService.post(`/orders/${order.id}/cancel`);
              const data = await response.json();
              if (data.success) {
                fetchOrders(); // Refresh orders list
              } else {
                Alert.alert('Error', data.message || 'Failed to cancel order');
              }
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const handleRebook = (order: Order) => {
    router.push({
      pathname: "/(services)/PlumberScreen",
      params: { categoryId: order.service.categoryId }
    });
  };

  const handleReview = (order: Order) => {
    // Navigate to review screen (to be implemented)
    Alert.alert('Coming Soon', 'Review feature will be available soon!');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return { bgColor: '#E8F5E9', textColor: '#4CAF50' };
      case 'pending':
        return { bgColor: '#FFF3E0', textColor: '#FF9800' };
      case 'completed':
        return { bgColor: '#E3F2FD', textColor: '#2196F3' };
      case 'in_progress':
        return { bgColor: '#E8F5E9', textColor: '#4CAF50' };
      default:
        return { bgColor: '#F5F5F5', textColor: '#9E9E9E' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            selectedTab === 'active' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'active' && styles.activeTabText
          ]}>Active Orders</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{activeOrders.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            selectedTab === 'completed' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'completed' && styles.activeTabText
          ]}>Completed</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{completedOrders.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={selectedTab === 'active' ? activeOrders : completedOrders}
        renderItem={({ item }) => renderOrderCard(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4ED',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4E60FF',
  },
  tabText: {
    fontSize: 16,
    color: '#666B8F',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4E60FF',
    fontWeight: '600',
  },
  badgeContainer: {
    backgroundColor: '#F0F3FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#4E60FF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2243',
  },
  serviceType: {
    fontSize: 14,
    color: '#666B8F',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666B8F',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E60FF',
  },
  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E4ED',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666B8F',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4E60FF',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E4ED',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1E2243',
  },
});