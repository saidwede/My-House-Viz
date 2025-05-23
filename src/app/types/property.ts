
export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'studio' | 'loft';
  price: number;
  surface: number;
  rooms: number;
  location: {
    city: string;
    department: string;
    coordinates: [number, number]; // [lng, lat]
  };
  images: string[];
  description: string;
  features: string[];
  energyClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}

export interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  rooms?: number;
  type?: Property['type'];
  searchQuery?: string;
}
