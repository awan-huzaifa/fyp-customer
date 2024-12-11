import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons';
import ApiService from '../../services/ApiService';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CallScreen from './CallScreen';

// Extended vendor interface
interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: string;
  hasSmartphone: boolean;
  phoneForCalls?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const VendorCard = ({ 
  vendor,
  onConfirm 
}: { 
  vendor: Vendor;
  onConfirm: (vendor: Vendor) => void;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.vendorName}>{vendor.name}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>
            {vendor.rating} ({vendor.reviews} reviews)
          </Text>
        </View>
        <Text style={styles.price}>{vendor.price}</Text>
        {!vendor.hasSmartphone && (
          <Text style={styles.phoneNote}>* This vendor will be contacted via phone call</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.confirmButton, { backgroundColor: '#4E60FF' }]} 
          onPress={() => onConfirm(vendor)}
        >
          <Text style={styles.confirmButtonText}>Select Vendor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VendorListScreen = () => {
  const router = useRouter();
  const { serviceId, serviceName, categoryId } = useLocalSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showCallScreen, setShowCallScreen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [region, setRegion] = useState({
    latitude: 31.5204,  // Lahore coordinates
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadVendors();
  }, [serviceId, categoryId]);

  const loadVendors = async () => {
    try {
      const response = await ApiService.get(`/vendors/by-service?categoryId=${categoryId}&serviceId=${serviceId}`);
      const data = await response.json();
      
      if (data.success) {
        setVendors(data.vendors);
      } else {
        Alert.alert('Error', data.message || 'Failed to load vendors');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelect = async (vendor: Vendor) => {
    if (vendor.hasSmartphone) {
      Alert.alert(
        'Smartphone User',
        'This vendor uses the mobile app. This feature will be implemented soon.'
      );
      return;
    }

    try {
      console.log('Creating order for vendor:', vendor.id);
      
      // Create the order first
      const orderResponse = await ApiService.post('/orders', {
        vendorId: vendor.id,
        serviceId,
        categoryId,
        location: {
          latitude: region.latitude,
          longitude: region.longitude,
          address: 'Customer Address'
        },
        description: `New ${serviceName} service request`
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      console.log('Order created:', orderData);
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      setSelectedVendor(vendor);
      setCurrentOrderId(orderData.order.id);
      setShowCallScreen(true);
      
      console.log('Initiating IVR call for order:', orderData.order.id);
      
      // Initiate IVR call
      const ivrResponse = await ApiService.post('/ivr/call', {
        orderId: orderData.order.id
      });

      if (!ivrResponse.ok) {
        throw new Error('Failed to initiate call');
      }

      const ivrData = await ivrResponse.json();
      console.log('IVR call initiated:', ivrData);
      
      if (!ivrData.success) {
        throw new Error(ivrData.message || 'Failed to initiate call to vendor');
      }

    } catch (error: any) {
      console.error('Error in handleVendorSelect:', error);
      Alert.alert('Error', error.message || 'Failed to process your request');
      setShowCallScreen(false);
      setSelectedVendor(null);
      setCurrentOrderId('');
    }
  };

  const handleCallScreenClose = () => {
    setShowCallScreen(false);
    setSelectedVendor(null);
    setCurrentOrderId('');
  };

  const handleOrderAccepted = () => {
    router.push({
      pathname: "/(services)/OrderConfirmationScreen" as any,
      params: {
        vendorId: selectedVendor?.id,
        orderId: currentOrderId,
        serviceId,
        categoryId
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E60FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
      >
        {vendors.map((vendor) => (
          <Marker
            key={vendor.id}
            coordinate={{
              latitude: vendor.location.latitude,
              longitude: vendor.location.longitude
            }}
            title={vendor.name}
            description={`Rating: ${vendor.rating} • ${vendor.reviews} reviews`}
          />
        ))}
      </MapView>
      <ScrollView style={styles.cardContainer}>
        {vendors.map((vendor) => (
          <VendorCard 
            key={vendor.id} 
            vendor={vendor}
            onConfirm={handleVendorSelect}
          />
        ))}
      </ScrollView>

      {selectedVendor && showCallScreen && (
        <CallScreen
          vendor={selectedVendor}
          orderId={currentOrderId}
          onClose={handleCallScreenClose}
          onOrderAccepted={handleOrderAccepted}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7FF',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 12,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E2243',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    color: '#666B8F',
  },
  price: {
    fontSize: 16,
    color: '#4E60FF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#4E60FF',
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
  },
  phoneNote: {
    color: '#666B8F',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default VendorListScreen; 