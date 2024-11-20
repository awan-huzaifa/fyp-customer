export const MOCK_DATA = {
  // Mock user data
  user: {
    id: 1,
    name: "John Doe",
    phone: "03001234567",
    role: "customer"
  },

  // Mock service categories
  categories: [
    { id: 1, name: 'Plumber', image: require('../assets/images/electrician.png') },
    { id: 2, name: 'Electrician', image: require('../assets/images/electrician.png') },
    { id: 3, name: 'AC Technician', image: require('../assets/images/electrician.png') },
    { id: 4, name: 'Mechanic', image: require('../assets/images/electrician.png') },
    { id: 5, name: 'Painter', image: require('../assets/images/electrician.png') }
  ],

  // Mock orders
  orders: [
    {
      id: '1',
      serviceType: 'Plumbing',
      providerName: 'Huzaifa',
      providerImage: 'https://via.placeholder.com/50',
      dateTime: 'Scheduled for March 20th, 2024, 10:00 AM',
      status: 'In Progress',
      price: 'Rs.100',
    },
    // ... other orders
  ]
}; 