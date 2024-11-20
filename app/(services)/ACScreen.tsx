import { createServiceScreen } from '../../utils/createServiceScreen';

const acServices = [
  { 
    id: '1', 
    name: 'AC Installation', 
    price: 'Rs.2000', 
    time: '2 hours', 
    rating: 4.7, 
    reviews: 85, 
    image: 'https://via.placeholder.com/100',
    description: 'Professional AC installation service',
    features: ['Expert installation', 'Quality service', '1-month warranty'],
    providers: [
      { id: 1, name: 'Usman', rating: 4.8, jobs: 180, image: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Ali', rating: 4.6, jobs: 130, image: 'https://via.placeholder.com/50' },
    ]
  },
  // Add more services...
];

export default createServiceScreen('AC Services', acServices); 