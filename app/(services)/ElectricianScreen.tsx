import React from 'react';
import { createServiceScreen } from '../../utils/createServiceScreen';

const electricianServices = [
  { 
    id: '1', 
    name: 'Fan Installation', 
    price: 'Rs.300', 
    time: '1 hour', 
    rating: 4.8, 
    reviews: 120, 
    image: 'https://via.placeholder.com/100',
    description: 'Professional fan installation service',
    features: ['Quality work', 'Expert installation', '1-month warranty'],
    providers: [
      { id: 1, name: 'Kamran', rating: 4.9, jobs: 200, image: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Salman', rating: 4.7, jobs: 150, image: 'https://via.placeholder.com/50' },
    ]
  },
];

const ElectricianScreen = createServiceScreen('Electrical Services', electricianServices);

export default ElectricianScreen;