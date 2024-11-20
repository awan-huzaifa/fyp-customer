import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Animated,
  Dimensions,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const services = [
  { 
    id: '1', 
    name: 'Pipe Installation', 
    price: 'Rs.500', 
    time: '2 hours', 
    rating: 4.8, 
    reviews: 90, 
    image: 'https://via.placeholder.com/100',
    description: 'Professional pipe installation service including material and labor',
    features: ['Quality materials', 'Expert installation', '1-month warranty'],
    providers: [
      { id: 1, name: 'Ahmed', rating: 4.9, jobs: 150, image: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Bilal', rating: 4.7, jobs: 120, image: 'https://via.placeholder.com/50' },
    ]
  },
  // ... more services
];

// Create animated FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface PlumberScreenProps {
  screenTitle?: string;
  services?: any[];
  customStyles?: any;
}

function PlumberScreenComponent({ 
  screenTitle = 'Plumbing Services',
  services: initialServices = services,
  customStyles = {}
}: PlumberScreenProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Animation values
  const scrollY = new Animated.Value(0);
  const [cardAnimations] = useState(() => 
    initialServices.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate cards on mount
    initialServices.forEach((_, index) => {
      Animated.spring(cardAnimations[index], {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    });
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleBooking = async (provider: any) => {
    try {
      setSelectedProvider(provider);
      // Show confirmation dialog
      Alert.alert(
        'Confirm Booking',
        `Would you like to book ${provider.name} for this service?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setSelectedProvider(null)
          },
          {
            text: 'Book',
            onPress: async () => {
              try {
                // Here you'll add the actual booking logic later
                Alert.alert('Success', 'Booking request sent successfully!');
                setModalVisible(false);
                setSelectedProvider(null);
              } catch (error) {
                Alert.alert('Error', 'Failed to create booking');
                setSelectedProvider(null);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Something went wrong');
      setSelectedProvider(null);
    }
  };

  const renderServiceCard = ({ item, index }: { item: any; index: number }) => {
    const scale = cardAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <Animated.View style={[styles.serviceCard, { transform: [{ scale }] }]}>
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => {
            setSelectedService(item);
            setModalVisible(true);
          }}
        >
          <Image source={{ uri: item.image }} style={styles.serviceImage} />
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.servicePrice}>{item.price}</Text>
            <View style={styles.serviceDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#666B8F" />
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.detailText}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => handleBooking(item.providers[0])}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderServiceModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <BlurView intensity={100} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image 
              source={{ uri: selectedService?.image }} 
              style={styles.modalImage}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.modalInfo}>
              <Text style={styles.modalTitle}>{selectedService?.name}</Text>
              <Text style={styles.modalPrice}>{selectedService?.price}</Text>
              <Text style={styles.modalDescription}>
                {selectedService?.description}
              </Text>

              <Text style={styles.sectionTitle}>Features</Text>
              {selectedService?.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Available Providers</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.providersContainer}
              >
                {selectedService?.providers.map((provider: any) => (
                  <TouchableOpacity 
                    key={provider.id}
                    style={styles.providerCard}
                    onPress={() => setSelectedProvider(provider)}
                  >
                    <Image 
                      source={{ uri: provider.image }} 
                      style={styles.providerImage}
                    />
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <View style={styles.providerStats}>
                      <Text style={styles.providerRating}>⭐ {provider.rating}</Text>
                      <Text style={styles.providerJobs}>{provider.jobs} jobs</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.modalBookButton}
            onPress={() => {
              setModalVisible(false);
              // Handle booking
            }}
          >
            <Text style={styles.modalBookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -50],
                extrapolate: 'clamp',
              }),
            }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4E60FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{screenTitle}</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="options" size={24} color="#4E60FF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666B8F" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0A3BD"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666B8F" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Service List - Replace FlatList with AnimatedFlatList */}
      <AnimatedFlatList
        data={initialServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.serviceList}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Service Detail Modal */}
      {renderServiceModal()}

      {/* Provider Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedProvider}
        onRequestClose={() => setSelectedProvider(null)}
      >
        {/* Provider booking modal content */}
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        {/* Filter modal content */}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4ED',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2243',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E4ED',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: '#1E2243',
  },
  serviceList: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2243',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4E60FF',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666B8F',
  },
  bookButton: {
    backgroundColor: '#4E60FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2243',
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4E60FF',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666B8F',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2243',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666B8F',
  },
  providersContainer: {
    marginBottom: 24,
  },
  providerCard: {
    backgroundColor: '#F8F9FF',
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 150,
    alignItems: 'center',
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2243',
    marginBottom: 4,
  },
  providerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  providerRating: {
    fontSize: 14,
    color: '#666B8F',
  },
  providerJobs: {
    fontSize: 14,
    color: '#666B8F',
  },
  modalBookButton: {
    backgroundColor: '#4E60FF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlumberScreenComponent;
export { PlumberScreenComponent as PlumberScreen };