import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DATA } from '../../utils/mockData';
import { useRouter } from 'expo-router';

const activeOrders = MOCK_DATA.orders.filter(order => 
  order.status === 'In Progress' || order.status === 'Pending'
);

const completedOrders = MOCK_DATA.orders.filter(order => 
  order.status === 'Completed'
);

export default function OrderTabScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [fadeAnim] = useState(new Animated.Value(1));

  const renderOrderCard = (order: any) => {
    const isActive = order.status !== 'Completed';

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
            {order.status}
          </Text>
        </View>

        {/* Service Provider Info */}
        <View style={styles.providerSection}>
          <Image 
            source={{ uri: order.providerImage }} 
            style={styles.providerImage}
          />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{order.providerName}</Text>
            <Text style={styles.serviceType}>{order.serviceType}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.price}>{order.price}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666B8F" />
            <Text style={styles.detailText}>{order.dateTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666B8F" />
            <Text style={styles.detailText}>123 Main St, Block 6</Text>
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

  const handleContact = (order: any) => {
    // Implement contact functionality
    Alert.alert('Contact', `Calling ${order.providerName}...`);
  };

  const handleCancel = (order: any) => {
    // Implement cancel functionality
    Alert.alert('Cancel', 'Are you sure you want to cancel this order?');
  };

  const handleRebook = (order: any) => {
    // Implement rebook functionality
    Alert.alert('Rebook', 'Rebooking this service...');
  };

  const handleReview = (order: any) => {
    // Implement review functionality
    Alert.alert('Review', 'Write a review...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return { bgColor: '#E8F5E9', textColor: '#4CAF50' };
      case 'Pending':
        return { bgColor: '#FFF3E0', textColor: '#FF9800' };
      case 'Completed':
        return { bgColor: '#E3F2FD', textColor: '#2196F3' };
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
  providerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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