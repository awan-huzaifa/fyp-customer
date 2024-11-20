import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { id: '1', name: 'Interior Painting', price: '$200', time: 'Approx. 3 hours', rating: 4.8, reviews: 90, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Exterior Painting', price: '$300', time: 'Approx. 5 hours', rating: 4.7, reviews: 70, image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Touch Up Painting', price: '$100', time: 'Approx. 1 hour', rating: 4.9, reviews: 50, image: 'https://via.placeholder.com/100' },
];

const PainterScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderServiceCard = ({ item }) => (
    <View style={styles.serviceCard}>
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>Base Price: {item.price}</Text>
        <Text style={styles.serviceTime}>Estimated Time: {item.time}</Text>
        <Text style={styles.serviceRating}>⭐{item.rating} ({item.reviews} reviews)</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('View Details')} style={styles.viewDetails}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4E60FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painter Services</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#4E60FF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Painter Services..."
          placeholderTextColor="#A0A3BD"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Service Cards */}
      <FlatList
        data={services}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.serviceList}
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filter & Sort</Text>
          <Pressable style={styles.filterOption} onPress={() => alert('Price Range')}>
            <Text>Price Range</Text>
          </Pressable>
          <Pressable style={styles.filterOption} onPress={() => alert('Ratings')}>
            <Text>Ratings</Text>
          </Pressable>
          <Pressable style={styles.filterOption} onPress={() => alert('Completion Time')}>
            <Text>Completion Time</Text>
          </Pressable>
          <Pressable style={styles.filterOption} onPress={() => alert('Availability')}>
            <Text>Availability</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Navigation Tabs */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderTabScreen')}>
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E2243',
    textAlign: 'center',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchButton: {
    backgroundColor: '#4E60FF',
    borderRadius: 25,
    padding: 10,
    marginLeft: 10,
  },
  serviceList: {
    paddingBottom: 100,
  },
  serviceCard: {
    flexDirection: 'row',
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
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: 14,
    color: '#4E60FF',
  },
  serviceTime: {
    fontSize: 14,
    color: '#808080',
  },
  serviceRating: {
    fontSize: 14,
    color: '#FFD700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: '#4E60FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  viewDetails: {
    marginLeft: 10,
  },
  viewDetailsText: {
    color: '#4E60FF',
    textDecorationLine: 'underline',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4ED',
    width: '100%',
    alignItems: 'flex-start',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#4E60FF',
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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

export default PainterScreen;