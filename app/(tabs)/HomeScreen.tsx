import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Image, 
  Dimensions,
  Animated,
  RefreshControl,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MOCK_DATA } from '../../utils/mockData';
import { SharedElement } from 'react-navigation-shared-element';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

// Define style types
type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  greeting: TextStyle;
  subtitle: TextStyle;
  profileButton: ViewStyle;
  searchContainer: ViewStyle;
  searchBar: ViewStyle;
  searchInput: TextStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  featuredContainer: ViewStyle;
  featuredCard: ViewStyle;
  featuredImage: ImageStyle;
  featuredContent: ViewStyle;
  featuredTitle: TextStyle;
  featuredPrice: TextStyle;
  servicesGrid: ViewStyle;
  serviceCard: ViewStyle;
  serviceIconContainer: ViewStyle;
  serviceIcon: ImageStyle;
  serviceName: TextStyle;
  seeAllButton: TextStyle;
  orderCard: ViewStyle;
  orderHeader: ViewStyle;
  orderType: ViewStyle;
  orderTypeText: TextStyle;
  orderTime: TextStyle;
  orderPrice: TextStyle;
  cardTouchable: ViewStyle;
  serviceStats: ViewStyle;
  statText: TextStyle;
  ratingContainer: ViewStyle;
  ratingText: TextStyle;
  orderStatus: (status: string) => TextStyle;
};

interface UserData {
  name: string;
  phone: string;
  email?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const categories = MOCK_DATA.categories;
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  // Animation values
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });

  // Card animation values
  const [cardAnimations] = useState(() => 
    categories.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate cards on mount
    categories.forEach((_, index) => {
      Animated.spring(cardAnimations[index], {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    });
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const userData: UserData = JSON.parse(storedData);
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const renderServiceCard = (service: any, index: number) => {
    const scale = cardAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    const opacity = cardAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        key={service.id}
        style={[
          styles.serviceCard,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedCategory(service.name);
            if (service.name === 'Plumber') {
              router.push('/PlumberScreen');
            } else if (service.name === 'Electrician') {
              router.push('/ElectricianScreen');
            } else if (service.name === 'AC Technician' || service.name === 'AC') {
              router.push('/(services)/ACTechnicianScreen');
            } else if (service.name === 'Mechanic' || service.name === 'Car Mechanic') {
              router.push('/(services)/MechanicScreen');
            } else if (service.name === 'Painter') {
              Alert.alert(
                'Coming Soon!',
                'Painter services are currently under development. We will notify you once they are available.',
                [{ text: 'OK', style: 'default' }]
              );
            }
          }}
          style={styles.cardTouchable}
        >
          <SharedElement id={`service.${service.id}.image`}>
            <View style={styles.serviceIconContainer}>
              <Image source={service.image} style={styles.serviceIcon} />
            </View>
          </SharedElement>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.serviceStats}>
            <Text style={styles.statText}>⭐ 4.8</Text>
            <Text style={styles.statText}>5 km</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View>
          <Text style={styles.greeting}>Hello, {userName || 'User'} 👋</Text>
          <Text style={styles.subtitle}>What service do you need?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#4E60FF" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar with Animation */}
        <Animated.View style={[styles.searchContainer]}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#666B8F" />
            <TextInput
              placeholder="Search services..."
              placeholderTextColor="#666B8F"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666B8F" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Featured Services with Horizontal Scroll */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {categories.slice(0, 3).map((service, index) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.featuredCard}
                onPress={() => {
                  // Add haptic feedback here
                  if (service.name === 'Plumber') {
                    router.push('/PlumberScreen');
                  }
                }}
              >
                <SharedElement id={`featured.${service.id}.image`}>
                  <Image source={service.image} style={styles.featuredImage} />
                </SharedElement>
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{service.name}</Text>
                  <Text style={styles.featuredPrice}>Starting from Rs.500</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>4.8 (120+)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Services Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Services</Text>
          <View style={styles.servicesGrid}>
            {categories.map((service, index) => renderServiceCard(service, index))}
          </View>
        </View>

        {/* Recent Orders Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/OrderTabScreen')}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          {MOCK_DATA.orders.slice(0, 2).map((order) => (
            <Animated.View 
              key={order.id} 
              style={[styles.orderCard]}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderType}>
                  <Ionicons name="construct-outline" size={20} color="#4E60FF" />
                  <Text style={styles.orderTypeText}>{order.serviceType}</Text>
                </View>
                <Text style={styles.orderStatus(order.status)}>{order.status}</Text>
              </View>
              <Text style={styles.orderTime}>{order.dateTime}</Text>
              <Text style={styles.orderPrice}>{order.price}</Text>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2243',
  },
  subtitle: {
    fontSize: 16,
    color: '#666B8F',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E2243',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2243',
  },
  featuredContainer: {
    paddingVertical: 8,
  },
  featuredCard: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2243',
  },
  featuredPrice: {
    fontSize: 14,
    color: '#4E60FF',
    marginTop: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  serviceCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2243',
    textAlign: 'center',
  },
  seeAllButton: {
    color: '#4E60FF',
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTypeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2243',
  },
  orderStatus: (status: string): TextStyle => ({
    fontSize: 14,
    fontWeight: '500',
    color: status === 'In Progress' ? '#4CAF50' : '#FF9800',
  }),
  orderTime: {
    fontSize: 14,
    color: '#666B8F',
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E60FF',
  },
  cardTouchable: {
    width: '100%',
    alignItems: 'center',
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  statText: {
    fontSize: 12,
    color: '#666B8F',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666B8F',
  },
});