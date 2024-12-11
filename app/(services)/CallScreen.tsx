import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons';
import ApiService from '../../services/ApiService';

interface CallScreenProps {
  vendor: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    price: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  orderId: string;
  onClose: () => void;
  onOrderAccepted: () => void;
}

const CallScreen = ({ vendor, orderId, onClose, onOrderAccepted }: CallScreenProps) => {
  const [timer, setTimer] = useState(0);
  const [callStatus, setCallStatus] = useState<'calling' | 'accepted' | 'rejected' | 'no_response'>('calling');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isSubscribed = true;  // For cleanup
    
    // Poll for order status
    const pollInterval = setInterval(async () => {
      if (!isSubscribed) return;  // Don't continue if unmounted
      
      try {
        console.log('Polling order status for:', orderId);
        const response = await ApiService.get(`/orders/${orderId}/status`);
        const data = await response.json();
        
        console.log('Order status response:', data);
        
        if (!isSubscribed) return;  // Don't update state if unmounted
        
        if (data.success && data.order) {
          console.log('Current order status:', data.order.status);
          
          if (data.order.status === 'accepted') {
            console.log('Order accepted, navigating to confirmation screen');
            setCallStatus('accepted');
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            
            // Show accepted message for 1.5 seconds
            setTimeout(() => {
              if (!isSubscribed) return;
              onOrderAccepted(); // Navigate first
              setTimeout(() => {
                if (!isSubscribed) return;
                onClose(); // Then close modal
              }, 500);
            }, 1500);
          } else if (data.order.status === 'rejected') {
            console.log('Order rejected, closing call screen');
            setCallStatus('rejected');
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setTimeout(() => {
              if (isSubscribed) onClose();
            }, 2000);
          } else if (data.order.status === 'vendor_unavailable') {
            console.log('Vendor unavailable, closing call screen');
            setCallStatus('no_response');
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setTimeout(() => {
              if (isSubscribed) onClose();
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling order status:', error);
      }
    }, 2000);  // Poll every 2 seconds

    // Clear interval after 2 minutes (timeout)
    const timeoutId = setTimeout(() => {
      if (!isSubscribed) return;  // Don't continue if unmounted
      
      clearInterval(pollInterval);
      if (callStatus === 'calling') {
        console.log('Call timed out, closing screen');
        setCallStatus('no_response');
        setTimeout(() => {
          if (isSubscribed) onClose();
        }, 2000);
      }
    }, 120000);

    // Cleanup function
    return () => {
      console.log('Cleaning up CallScreen');
      isSubscribed = false;
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
  }, [orderId, onClose, onOrderAccepted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    switch (callStatus) {
      case 'accepted':
        return 'Order Accepted! Redirecting...';
      case 'rejected':
        return 'Order Declined';
      case 'no_response':
        return 'No Response from Vendor';
      default:
        return 'Calling Vendor...';
    }
  };

  return (
    <Modal transparent animationType="fade">
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: vendor.location.latitude,
            longitude: vendor.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <AntDesign name="close" size={24} color="#666B8F" />
            </TouchableOpacity>
            <Text style={styles.title}>Your Vendor is being Contacted</Text>
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              <Text style={styles.price}>{vendor.price}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {vendor.rating} ({vendor.reviews})
              </Text>
            </View>
            <View style={styles.callStatus}>
              <Text style={styles.callingText}>{getStatusMessage()}</Text>
              <Text style={styles.timer}>{formatTime(timer)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2243',
    marginBottom: 16,
    marginTop: 8,
  },
  vendorInfo: {
    marginBottom: 12,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2243',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#4E60FF',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    marginLeft: 4,
    color: '#666B8F',
  },
  callStatus: {
    alignItems: 'center',
    marginTop: 16,
  },
  callingText: {
    fontSize: 16,
    color: '#1E2243',
    marginBottom: 8,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E60FF',
  },
});

export default CallScreen;