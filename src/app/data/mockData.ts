
import { Property } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Appartement lumineux avec vue sur Seine',
    type: 'apartment',
    price: 850000,
    surface: 85,
    rooms: 3,
    location: {
      city: 'Paris 7e',
      department: 'Paris',
      coordinates: [2.3175, 48.8566]
    },
    images: ['/placeholder.svg'],
    description: 'Magnifique appartement rénové dans un immeuble haussmannien',
    features: ['Balcon', 'Cave', 'Gardien', 'Ascenseur'],
    energyClass: 'C'
  },
  {
    id: '2',
    title: 'Maison familiale avec jardin',
    type: 'house',
    price: 450000,
    surface: 120,
    rooms: 5,
    location: {
      city: 'Lyon',
      department: 'Rhône',
      coordinates: [4.8357, 45.7640]
    },
    images: ['/placeholder.svg'],
    description: 'Belle maison avec jardin arboré dans quartier calme',
    features: ['Jardin', 'Garage', 'Cheminée', 'Terrasse'],
    energyClass: 'B'
  },
  {
    id: '3',
    title: 'Studio moderne centre-ville',
    type: 'studio',
    price: 180000,
    surface: 25,
    rooms: 1,
    location: {
      city: 'Marseille',
      department: 'Bouches-du-Rhône',
      coordinates: [5.3698, 43.2965]
    },
    images: ['/placeholder.svg'],
    description: 'Studio récemment rénové, idéal investissement locatif',
    features: ['Climatisation', 'Proche transports', 'Meublé'],
    energyClass: 'D'
  },
  {
    id: '4',
    title: 'Loft atypique ancien entrepôt',
    type: 'loft',
    price: 650000,
    surface: 95,
    rooms: 2,
    location: {
      city: 'Bordeaux',
      department: 'Gironde',
      coordinates: [0.5792, 44.8378]
    },
    images: ['/placeholder.svg'],
    description: 'Loft unique dans ancien entrepôt réhabilité',
    features: ['Hauteur sous plafond', 'Poutres apparentes', 'Mezzanine'],
    energyClass: 'E'
  },
  {
    id: '5',
    title: 'Appartement neuf standing',
    type: 'apartment',
    price: 320000,
    surface: 65,
    rooms: 3,
    location: {
      city: 'Nantes',
      department: 'Loire-Atlantique',
      coordinates: [1.5534, 47.2184]
    },
    images: ['/placeholder.svg'],
    description: 'Appartement neuf dans résidence de standing',
    features: ['Balcon', 'Parking', 'Piscine', 'Concierge'],
    energyClass: 'A'
  },
  {
    id: '6',
    title: 'Maison de maître rénovée',
    type: 'house',
    price: 780000,
    surface: 180,
    rooms: 7,
    location: {
      city: 'Toulouse',
      department: 'Haute-Garonne',
      coordinates: [1.4442, 43.6047]
    },
    images: ['/placeholder.svg'],
    description: 'Maison de maître entièrement rénovée avec goût',
    features: ['Jardin', 'Piscine', 'Garage double', 'Bureau'],
    energyClass: 'B'
  },
  {
    id: '7',
    title: 'Appartement vue mer',
    type: 'apartment',
    price: 590000,
    surface: 75,
    rooms: 3,
    location: {
      city: 'Nice',
      department: 'Alpes-Maritimes',
      coordinates: [7.2619, 43.7102]
    },
    images: ['/placeholder.svg'],
    description: 'Splendide appartement avec vue panoramique sur la mer',
    features: ['Vue mer', 'Terrasse', 'Climatisation', 'Parking'],
    energyClass: 'C'
  },
  {
    id: '8',
    title: 'Maison contemporaine',
    type: 'house',
    price: 420000,
    surface: 110,
    rooms: 4,
    location: {
      city: 'Rennes',
      department: 'Ille-et-Vilaine',
      coordinates: [1.6778, 48.1173]
    },
    images: ['/placeholder.svg'],
    description: 'Maison contemporaine dans quartier résidentiel',
    features: ['Jardin', 'Garage', 'Cellier', 'Buanderie'],
    energyClass: 'A'
  }
];
