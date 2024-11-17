import React from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const offers = [
  { id: '1', image: 'https://via.placeholder.com/300x150' },
  { id: '2', image: 'https://via.placeholder.com/300x150' },
  { id: '3', image: 'https://via.placeholder.com/300x150' },
];

const categories = [
  { id: '1', name: 'Electrician', image: require('../assets/images/electrician.png') },
  { id: '2', name: 'Plumber', image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Ac', image: 'https://via.placeholder.com/100' },
  { id: '4', name: 'Painter', image: 'https://via.placeholder.com/100' },
  { id: '5', name: 'Mechanic', image: 'https://via.placeholder.com/100' },
  { id: '6', name: 'Cleaning', image: 'https://via.placeholder.com/100' },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={40} color="#4E60FF" />
        <Text style={styles.welcomeText}>Welcome, User!</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for services..."
        placeholderTextColor="#A0A3BD"
      />

      {/* Offers Section */}
      <Text style={styles.subheading}>Offers for You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offerSlider}>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <Image source={{ uri: offer.image }} style={styles.offerImage} />
          </View>
        ))}
      </ScrollView>

      {/* Categories Section */}
      <Text style={styles.subheading}>Services</Text>
      <FlatList
  data={categories}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard} 
      onPress={() => navigation.navigate(`${item.name}Screen`)} // Navigate to the respective screen
    >
      <Image source={item.image } style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )}
  keyExtractor={(item) => item.id}
  numColumns={3}
  columnWrapperStyle={styles.categoryRow}
/>

      {/* Navigation Tabs */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navItem}>
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
    marginBottom: 16,
    marginTop: 16
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1E2243',
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E2243',
  },
  offerSlider: {
    marginBottom: 16,
  },
  offerCard: {
    width: width * 0.8,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#8b5cf6',

    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  categoryName: {
    marginTop: 5,
    fontWeight: '500',
    color: '#ffffff',
  },
  categoryRow: {
    justifyContent: 'space-between',
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

export default HomeScreen;