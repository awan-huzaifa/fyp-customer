import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ApiService from '../../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeocodingService from '../../services/GeocodingService';
import { validateAddress } from '../../utils/validation';

interface Address {
  id: number;
  label: string;
  address: string;
  details?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export default function AddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);  
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    address: '',
    details: '',
    location: null as { latitude: number; longitude: number; } | null,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await ApiService.get('/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location services');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates
      try {
        const address = await GeocodingService.getAddressFromCoordinates(latitude, longitude);
        setFormData(prev => ({
          ...prev,
          address,
          location: { latitude, longitude }
        }));
      } catch (error) {
        console.error('Geocoding error:', error);
        Alert.alert('Error', 'Failed to get address from location');
      }

      return { latitude, longitude };
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      return null;
    }
  };

  const handleAddressSearch = async (searchText: string) => {
    try {
      const coordinates = await GeocodingService.getCoordinatesFromAddress(searchText);
      setFormData(prev => ({
        ...prev,
        address: searchText,
        location: coordinates
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to find location for this address');
    }
  };

  const handleAddAddress = async () => {
    // Validate form data
    const validation = validateAddress({
      label: formData.label,
      address: formData.address,
      details: formData.details,
      location: formData.location
    });

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join('\n');
      Alert.alert('Validation Error', errorMessages);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await ApiService.post('/addresses', {
        ...formData,
        isDefault: addresses.length === 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        loadAddresses();
        setModalVisible(false);
        setFormData({ label: '', address: '', details: '', location: null });
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to add address');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              const response = await ApiService.delete(`/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (response.ok) {
                loadAddresses();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          }
        }
      ]
    );
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.labelContainer}>
          <Ionicons 
            name={item.label === 'Home' ? 'home' : item.label === 'Work' ? 'briefcase' : 'location'}
            size={24}
            color="#4E60FF"
          />
          <Text style={styles.labelText}>{item.label}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => {
              setEditingAddress(item);
              setFormData({
                label: item.label,
                address: item.address,
                details: item.details || '',
                location: item.location,
              });
              setModalVisible(true);
            }}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={20} color="#4E60FF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDeleteAddress(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={20} color="#FF4E4E" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressText}>{item.address}</Text>
      {item.details && <Text style={styles.detailsText}>{item.details}</Text>}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E60FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setEditingAddress(null);
            setFormData({ label: '', address: '', details: '', location: null });
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#4E60FF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Label</Text>
              <View style={styles.labelButtons}>
                {['Home', 'Work', 'Other'].map((label) => (
                  <TouchableOpacity
                    key={label}
                    style={[
                      styles.labelButton,
                      formData.label === label && styles.labelButtonSelected
                    ]}
                    onPress={() => setFormData({ ...formData, label })}
                  >
                    <Text style={[
                      styles.labelButtonText,
                      formData.label === label && styles.labelButtonTextSelected
                    ]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Search for an address"
                  onSubmitEditing={() => handleAddressSearch(formData.address)}
                />
                <TouchableOpacity 
                  style={styles.getCurrentLocationButton}
                  onPress={getCurrentLocation}
                >
                  <Ionicons name="location" size={24} color="#4E60FF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional Details (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.details}
                onChangeText={(text) => setFormData({ ...formData, details: text })}
                placeholder="Floor, apartment number, etc."
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddAddress}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4ED',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2243',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 20,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2243',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F5F7FF',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666B8F',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#A0A3BD',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2243',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2243',
    marginBottom: 8,
  },
  labelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  labelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E4ED',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  labelButtonSelected: {
    backgroundColor: '#4E60FF',
    borderColor: '#4E60FF',
  },
  labelButtonText: {
    fontSize: 14,
    color: '#666B8F',
    fontWeight: '500',
  },
  labelButtonTextSelected: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E4ED',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E2243',
    backgroundColor: '#F8F9FF',
  },
  getCurrentLocationButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4E60FF',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E4ED',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E2243',
    backgroundColor: '#F8F9FF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FF',
  },
  saveButton: {
    backgroundColor: '#4E60FF',
  },
  cancelButtonText: {
    color: '#4E60FF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
}); 