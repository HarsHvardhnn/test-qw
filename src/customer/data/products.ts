import { Product } from '../context/ProductContext';

// Helper function to generate a unique ID
const generateId = (category: string, index: number) => `${category}-${index + 1}`;

export const products: Product[] = [
  // Refrigerators
  {
    id: generateId('ref', 0),
    name: 'Smart French Door Refrigerator with Family Hub™',
    brand: 'Samsung',
    model: 'RF28T5F01SR',
    price: 2499.99,
    originalPrice: 2999.99,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'appliances',
    type: 'Refrigerators',
    rating: 4.8,
    reviewCount: 245,
    isContractorChoice: true,
    dimensions: {
      width: 35.75,
      depth: 34,
      height: 70
    },
    capacity: 28,
    depthType: 'Standard Depth',
    features: [
      'Family Hub™ touchscreen',
      'FlexZone™ drawer',
      'Twin Cooling Plus™',
      'Built-in cameras'
    ],
    colors: ['stainless-steel', 'black-stainless', 'white'],
    deliveryDate: 'Mar 15, 2025',
    savings: {
      amount: 500,
      type: 'instant'
    },
    collection: 'Smart Home Series'
  },
  {
    id: generateId('ref', 1),
    name: 'Counter-Depth French Door Refrigerator',
    brand: 'LG',
    model: 'LFXC22526S',
    price: 2199.99,
    originalPrice: 2599.99,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd31?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'appliances',
    type: 'Refrigerators',
    rating: 4.7,
    reviewCount: 189,
    dimensions: {
      width: 35.75,
      depth: 30.25,
      height: 70.25
    },
    capacity: 22.5,
    depthType: 'Counter Depth',
    features: [
      'Door-in-Door®',
      'Dual Ice Maker',
      'SmartThinQ® Technology'
    ],
    colors: ['stainless-steel', 'black-stainless'],
    deliveryDate: 'Mar 10, 2025'
  },

  // Ovens
  {
    id: generateId('range', 0),
    name: 'Pro Series 36" Gas Range with Griddle',
    brand: 'Viking',
    model: 'VGR73626GSS',
    price: 7999.99,
    originalPrice: 8499.99,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'appliances',
    type: 'Ovens',
    rating: 4.9,
    reviewCount: 156,
    isContractorChoice: true,
    dimensions: {
      width: 35.875,
      depth: 29.75,
      height: 36
    },
    features: [
      'Six high-performance burners',
      'Infrared broiler',
      'Convection baking',
      'Professional-grade construction'
    ],
    colors: ['stainless-steel'],
    deliveryDate: 'Mar 20, 2025',
    collection: 'Professional Series'
  },

  // Dishwashers
  {
    id: generateId('dish', 0),
    name: '800 Series Dishwasher with Crystal Dry™',
    brand: 'Bosch',
    model: 'SHPM88Z75N',
    price: 1299.99,
    originalPrice: 1499.99,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'appliances',
    type: 'Dishwashers',
    rating: 4.8,
    reviewCount: 312,
    sponsored: true,
    dimensions: {
      width: 23.5,
      depth: 23.75,
      height: 33.875
    },
    features: [
      'Crystal Dry™ technology',
      'Flexible 3rd rack',
      'Ultra quiet operation - 40 dBA',
      'Home Connect™ enabled'
    ],
    colors: ['stainless-steel', 'black-stainless'],
    deliveryDate: 'Mar 8, 2025',
    savings: {
      amount: 200,
      type: 'instant'
    }
  },

  // Cabinetry
  {
    id: generateId('cab', 0),
    name: 'Shaker Style Cabinet Set - Complete Kitchen',
    brand: 'KraftMaid',
    model: 'SKCS-2025',
    price: 15999.99,
    originalPrice: 18999.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'cabinetry',
    type: 'Upper & Lower Cabinets',
    rating: 4.9,
    reviewCount: 89,
    isContractorChoice: true,
    features: [
      'All-plywood construction',
      'Soft-close hinges',
      'Dovetail drawers',
      'Custom sizing available'
    ],
    colors: ['white', 'gray', 'navy', 'natural'],
    deliveryDate: 'Apr 5, 2025',
    savings: {
      amount: 3000,
      type: 'instant'
    },
    collection: 'Shaker Series'
  },

  // Countertops
  {
    id: generateId('counter', 0),
    name: 'Quartz Countertop - Calacatta Gold',
    brand: 'Silestone',
    model: 'CAL-GOLD-2025',
    price: 4200.99,
    originalPrice: 4800.99,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'countertops',
    type: 'Quartz',
    rating: 4.7,
    reviewCount: 156,
    sponsored: true,
    features: [
      'Stain-resistant',
      'Scratch-resistant',
      'Non-porous surface',
      'Lifetime warranty'
    ],
    colors: ['calacatta-gold', 'pure-white', 'carrara'],
    deliveryDate: 'Mar 25, 2025',
    savings: {
      amount: 600,
      type: 'instant'
    }
  },

  // Flooring
  {
    id: generateId('floor', 0),
    name: 'Engineered Hardwood Flooring - Oak Natural',
    brand: 'Bruce',
    model: 'OAK-NAT-2025',
    price: 3800.99,
    originalPrice: 4200.99,
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'flooring',
    type: 'Hardwood',
    rating: 4.6,
    reviewCount: 234,
    isContractorChoice: true,
    features: [
      'Real wood veneer',
      'Moisture-resistant core',
      'Easy click-lock installation',
      '25-year warranty'
    ],
    colors: ['natural-oak', 'gunstock', 'espresso'],
    deliveryDate: 'Mar 18, 2025',
    savings: {
      amount: 400,
      type: 'instant'
    }
  },

  // Lighting
  {
    id: generateId('light', 0),
    name: 'Smart LED Recessed Lighting Kit',
    brand: 'Philips Hue',
    model: 'HUE-REC-2025',
    price: 299.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'lighting',
    type: 'Under-Cabinet Lighting',
    rating: 4.8,
    reviewCount: 178,
    sponsored: true,
    features: [
      'Color-changing capabilities',
      'Voice control compatible',
      'Smartphone app control',
      'Energy efficient'
    ],
    colors: ['white'],
    deliveryDate: 'Mar 5, 2025'
  },

  // Plumbing Fixtures
  {
    id: generateId('plumb', 0),
    name: 'Smart Touch Kitchen Faucet',
    brand: 'Delta',
    model: 'DELTA-TOUCH-2025',
    price: 499.99,
    originalPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0b?auto=format&fit=crop&q=80',
    category: 'Kitchen',
    subcategory: 'plumbing',
    type: 'Faucets',
    rating: 4.7,
    reviewCount: 245,
    isContractorChoice: true,
    features: [
      'Touch-activation',
      'Voice control',
      'LED temperature indicator',
      'Spot-resistant finish'
    ],
    colors: ['arctic-stainless', 'matte-black', 'champagne-bronze'],
    deliveryDate: 'Mar 12, 2025',
    savings: {
      amount: 100,
      type: 'instant'
    }
  }
];