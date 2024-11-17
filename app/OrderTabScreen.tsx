import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const activeOrders = [
  {
    id: '1',
    serviceType: 'Plumbing',
    providerName: 'Huzaifa',
    providerImage: 'https://via.placeholder.com/50',
    dateTime: 'Scheduled for March 20th, 2024, 10:00 AM',
    status: 'In Progress',
    price: 'Rs.100',
  },
  {
    id: '2',
    serviceType: 'Electrical',
    providerName: 'Iftikhar',
    providerImage: 'https://via.placeholder.com/50',
    dateTime: 'Scheduled for March 21st, 2024, 2:00 PM',
    status: 'Pending',
    price: 'Rs.150',
  },
];

const completedOrders = [
  {
    id: '3',
    serviceType: 'Home Cleaning',
    providerName: 'A.Qudoos',
    providerImage: 'https://via.placeholder.com/50',
    dateTime: 'Completed on March 15th, 2024',
    status: 'Completed',
    price: 'Rs.800',
  },
  {
    id: '4',
    serviceType: 'AC Repair',
    providerName: 'Sam',
    providerImage: 'https://via.placeholder.com/50',
    dateTime: 'Completed on March 10th, 2024',
    status: 'Completed',
    price: 'Rs.120',
  },
];

const OrderTabScreen = ({ navigation }) => {
  const renderOrderCard = (order) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.serviceType}>{order.serviceType}</Text>
        <Text style={styles.orderStatus(order.status)}>{order.status}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Image source={{ uri: order.providerImage }} style={styles.providerImage} />
        <View style={styles.details}>
          <Text style={styles.providerName}>{order.providerName}</Text>
          <Text style={styles.dateTime}>{order.dateTime}</Text>
          <Text style={styles.price}>{order.price}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {order.status === 'Completed' ? (
          <TouchableOpacity style={styles.rebookButton} onPress={() => alert('Rebooking...')}>
            <Text style={styles.buttonText}>Rebook</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.contactButton} onPress={() => alert('Contacting provider...')}>
            <Text style={styles.buttonText}>Contact Provider</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Active Orders</Text>
      <FlatList
        data={activeOrders}
        renderItem={({ item }) => renderOrderCard(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
      />

      <Text style={styles.sectionTitle}>Completed Orders</Text>
      <FlatList
        data={completedOrders}
        renderItem={({ item }) => renderOrderCard(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
      />
      
      {/* Bottom Navigation Tabs */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderTabScreen')}>
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PaymentsScreen')}>
          <Text style={styles.navText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SettingsScreen')}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    padding: 16,
  },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#6B46C1',
//     marginVertical: 10,
//   },
sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF', // Changed text color to white
    backgroundColor: '#6B46C1', // Set background color to purple
    padding: 10, // Optional: Add padding for better appearance
    borderRadius: 20, // Optional: Add border radius for rounded corners
    marginVertical: 10,
},
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderStatus: (status) => ({
    fontSize: 14,
    fontWeight: '600',
    color: status === 'Completed' ? '#4CAF50' : status === 'Pending' ? '#FF9800' : '#F44336',
  }),
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateTime: {
    fontSize: 14,
    color: '#808080',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E60FF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  Button: {
    backgroundrebookColor: '#4E60FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  contactButton: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E4ED',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#1E2243',
  },
});

export default OrderTabScreen;