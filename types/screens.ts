export interface ServiceScreenProps {
  screenTitle: string;
  services: Array<{
    id: string;
    name: string;
    price: string;
    time: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    features: string[];
    providers: Array<{
      id: number;
      name: string;
      rating: number;
      jobs: number;
      image: string;
    }>;
  }>;
  customStyles?: Record<string, any>;
} 