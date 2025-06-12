// Product Store Structure - Defines the complete hierarchy of home improvement categories and products

export interface ProductCategory {
  id: string;
  name: string;
  emoji: string; // Unicode emoji identifier
  subcategories: ProductSubcategory[];
}

export interface ProductSubcategory {
  id: string;
  name: string;
  description: string;
  products?: string[]; // Array of product types in this subcategory
}

export const storeStructure: ProductCategory[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '1️⃣',
    subcategories: [
      {
        id: 'appliances',
        name: 'Appliances',
        description: 'Major kitchen appliances for cooking, cooling, and cleaning',
        products: ['Refrigerators', 'Ovens', 'Dishwashers', 'Microwaves']
      },
      {
        id: 'cabinetry',
        name: 'Cabinetry & Storage',
        description: 'Storage solutions for kitchen organization',
        products: ['Upper & Lower Cabinets', 'Pantry Storage', 'Built-ins']
      },
      {
        id: 'countertops',
        name: 'Countertops',
        description: 'Durable surfaces for food preparation and kitchen work',
        products: ['Quartz', 'Granite', 'Butcher Block', 'Marble', 'Solid Surface']
      },
      {
        id: 'flooring',
        name: 'Kitchen Flooring',
        description: 'Durable and water-resistant flooring options',
        products: ['Tile', 'Luxury Vinyl Plank', 'Hardwood']
      },
      {
        id: 'lighting',
        name: 'Lighting Fixtures',
        description: 'Task and ambient lighting solutions',
        products: ['Pendant Lights', 'Under-Cabinet Lighting', 'Chandeliers']
      },
      {
        id: 'plumbing',
        name: 'Plumbing Fixtures',
        description: 'Sinks and faucets for kitchen use',
        products: ['Kitchen Sinks', 'Faucets', 'Pot Fillers']
      },
      {
        id: 'backsplash',
        name: 'Backsplashes & Wall Coverings',
        description: 'Decorative and protective wall solutions',
        products: ['Subway Tile', 'Mosaic Tile', 'Stone']
      },
      {
        id: 'ventilation',
        name: 'Kitchen Ventilation',
        description: 'Air quality and ventilation systems',
        products: ['Range Hoods', 'Exhaust Systems']
      },
      {
        id: 'smart-kitchen',
        name: 'Smart Kitchen Technology',
        description: 'Connected kitchen devices and automation',
        products: ['Smart Faucets', 'Smart Appliances', 'Smart Lighting']
      }
    ]
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    emoji: '2️⃣',
    subcategories: [
      {
        id: 'fixtures',
        name: 'Bathroom Fixtures',
        description: 'Essential bathroom plumbing fixtures',
        products: ['Sinks', 'Toilets', 'Bathtubs', 'Bidets']
      },
      {
        id: 'vanities',
        name: 'Vanities & Storage',
        description: 'Bathroom storage and organization solutions',
        products: ['Single & Double Vanities', 'Medicine Cabinets', 'Linen Storage']
      },
      {
        id: 'bathroom-flooring',
        name: 'Bathroom Flooring',
        description: 'Water-resistant flooring options',
        products: ['Tile', 'Luxury Vinyl Plank', 'Waterproof Hardwood']
      },
      {
        id: 'bathroom-countertops',
        name: 'Countertops',
        description: 'Durable vanity surfaces',
        products: ['Quartz', 'Granite', 'Marble', 'Solid Surface']
      },
      {
        id: 'bathroom-lighting',
        name: 'Lighting Fixtures',
        description: 'Task and ambient bathroom lighting',
        products: ['Vanity Lighting', 'Ceiling Lights', 'LED Mirrors']
      },
      {
        id: 'shower-systems',
        name: 'Shower & Tub Systems',
        description: 'Complete shower and bathing solutions',
        products: ['Showerheads', 'Full Shower Systems', 'Steam Showers']
      },
      {
        id: 'bathroom-walls',
        name: 'Backsplashes & Wall Coverings',
        description: 'Waterproof wall solutions',
        products: ['Tile', 'Waterproof Wall Panels', 'Decorative Stone']
      },
      {
        id: 'bathroom-plumbing',
        name: 'Plumbing Fixtures',
        description: 'Bathroom water fixtures',
        products: ['Faucets', 'Bathtub Fillers', 'Shower Systems']
      },
      {
        id: 'smart-bathroom',
        name: 'Smart Bathroom Technology',
        description: 'Connected bathroom devices',
        products: ['Smart Mirrors', 'Heated Floors', 'Digital Showers']
      }
    ]
  },
  {
    id: 'living-room',
    name: 'Living Room',
    emoji: '3️⃣',
    subcategories: [
      {
        id: 'seating',
        name: 'Seating & Furniture',
        description: 'Living room furniture essentials',
        products: ['Sofas', 'Sectionals', 'Recliners', 'Coffee Tables']
      },
      {
        id: 'living-lighting',
        name: 'Lighting Fixtures',
        description: 'Living room lighting solutions',
        products: ['Chandeliers', 'Recessed Lighting', 'Floor Lamps', 'Wall Sconces']
      },
      {
        id: 'living-flooring',
        name: 'Living Room Flooring',
        description: 'Flooring options for living spaces',
        products: ['Hardwood', 'Carpet', 'Luxury Vinyl Plank', 'Tile']
      },
      {
        id: 'entertainment',
        name: 'Entertainment & Media Centers',
        description: 'Media and entertainment solutions',
        products: ['TV Stands', 'Built-In Wall Units', 'Smart Home Hubs']
      },
      {
        id: 'fireplaces',
        name: 'Fireplaces & Heating',
        description: 'Heating and ambiance solutions',
        products: ['Gas Fireplaces', 'Electric Fireplaces', 'Wood Stoves']
      },
      {
        id: 'living-walls',
        name: 'Wall Coverings & Accent Features',
        description: 'Decorative wall treatments',
        products: ['Wood Paneling', 'Stone', 'Decorative Wallpaper']
      },
      {
        id: 'smart-living',
        name: 'Smart Home & Automation',
        description: 'Living room automation',
        products: ['Smart Thermostats', 'Lighting Control', 'Smart Speakers']
      }
    ]
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    emoji: '4️⃣',
    subcategories: [
      {
        id: 'dining-furniture',
        name: 'Dining Furniture',
        description: 'Dining room furniture essentials',
        products: ['Dining Tables', 'Chairs', 'Buffets', 'Bar Cabinets']
      },
      {
        id: 'dining-lighting',
        name: 'Lighting Fixtures',
        description: 'Dining room lighting solutions',
        products: ['Chandeliers', 'Pendant Lights', 'Wall Sconces']
      },
      {
        id: 'dining-flooring',
        name: 'Dining Room Flooring',
        description: 'Flooring options for dining areas',
        products: ['Hardwood', 'Tile', 'Luxury Vinyl Plank', 'Carpet']
      },
      {
        id: 'dining-walls',
        name: 'Wall Coverings & Accent Features',
        description: 'Decorative wall elements',
        products: ['Decorative Molding', 'Feature Walls', 'Wallpaper']
      },
      {
        id: 'smart-dining',
        name: 'Smart Dining Enhancements',
        description: 'Dining room automation',
        products: ['Smart Lighting', 'Adjustable Tables', 'Automated Blinds']
      }
    ]
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    emoji: '5️⃣',
    subcategories: [
      {
        id: 'bedroom-furniture',
        name: 'Bedroom Furniture',
        description: 'Essential bedroom furniture',
        products: ['Beds', 'Dressers', 'Nightstands', 'Wardrobes']
      },
      {
        id: 'bedroom-lighting',
        name: 'Lighting Fixtures',
        description: 'Bedroom lighting solutions',
        products: ['Ceiling Fans', 'Table Lamps', 'Wall Sconces', 'Smart Lighting']
      },
      {
        id: 'bedroom-flooring',
        name: 'Bedroom Flooring',
        description: 'Flooring options for bedrooms',
        products: ['Carpet', 'Hardwood', 'Luxury Vinyl Plank', 'Tile']
      },
      {
        id: 'closets',
        name: 'Closets & Storage Solutions',
        description: 'Bedroom storage systems',
        products: ['Custom Closets', 'Wardrobe Organizers', 'Built-In Storage']
      },
      {
        id: 'bedroom-walls',
        name: 'Wall Coverings & Accent Features',
        description: 'Bedroom wall treatments',
        products: ['Feature Walls', 'Decorative Molding', 'Wallpaper']
      },
      {
        id: 'smart-bedroom',
        name: 'Smart Bedroom Technology',
        description: 'Bedroom automation',
        products: ['Smart Beds', 'Automated Blinds', 'Smart Alarm Systems']
      }
    ]
  },
  {
    id: 'home-office',
    name: 'Home Office',
    emoji: '6️⃣',
    subcategories: [
      {
        id: 'office-furniture',
        name: 'Office Furniture',
        description: 'Home office essentials',
        products: ['Desks', 'Chairs', 'Storage Cabinets', 'Shelving']
      },
      {
        id: 'office-lighting',
        name: 'Lighting Fixtures',
        description: 'Office lighting solutions',
        products: ['Task Lighting', 'Ceiling Lights', 'Desk Lamps']
      },
      {
        id: 'office-flooring',
        name: 'Office Flooring',
        description: 'Flooring options for home offices',
        products: ['Hardwood', 'Luxury Vinyl Plank', 'Carpet', 'Tile']
      },
      {
        id: 'office-walls',
        name: 'Wall Coverings & Acoustic Panels',
        description: 'Office wall treatments',
        products: ['Soundproof Panels', 'Decorative Walls']
      },
      {
        id: 'smart-office',
        name: 'Smart Office Enhancements',
        description: 'Office automation',
        products: ['Standing Desks', 'Smart Thermostats', 'Automated Blinds']
      }
    ]
  },
  {
    id: 'laundry',
    name: 'Laundry Room / Mudroom',
    emoji: '7️⃣',
    subcategories: [
      {
        id: 'laundry-appliances',
        name: 'Laundry Appliances',
        description: 'Essential laundry equipment',
        products: ['Washers', 'Dryers', 'Utility Sinks']
      },
      {
        id: 'laundry-storage',
        name: 'Storage & Cabinetry',
        description: 'Laundry and mudroom organization',
        products: ['Laundry Cabinets', 'Mudroom Lockers', 'Shelving']
      },
      {
        id: 'laundry-flooring',
        name: 'Laundry Room Flooring',
        description: 'Water-resistant flooring options',
        products: ['Tile', 'Waterproof Luxury Vinyl Plank', 'Concrete']
      },
      {
        id: 'laundry-plumbing',
        name: 'Utility & Plumbing Fixtures',
        description: 'Laundry room plumbing',
        products: ['Laundry Sinks', 'Utility Faucets', 'Drain Systems']
      },
      {
        id: 'laundry-lighting',
        name: 'Lighting Fixtures',
        description: 'Laundry room lighting',
        products: ['Overhead LED Lighting', 'Task Lighting']
      }
    ]
  },
  {
    id: 'garage',
    name: 'Garage & Utility Spaces',
    emoji: '8️⃣',
    subcategories: [
      {
        id: 'garage-storage',
        name: 'Garage Storage Solutions',
        description: 'Garage organization systems',
        products: ['Cabinetry', 'Overhead Racks', 'Workbenches']
      },
      {
        id: 'garage-flooring',
        name: 'Garage Flooring',
        description: 'Durable garage floor options',
        products: ['Epoxy', 'Rubber Tiles', 'Concrete Sealers']
      },
      {
        id: 'garage-doors',
        name: 'Garage Doors & Openers',
        description: 'Garage access solutions',
        products: ['Smart Garage Doors', 'Traditional Roll-Up']
      },
      {
        id: 'garage-lighting',
        name: 'Lighting Fixtures',
        description: 'Garage lighting solutions',
        products: ['Overhead Fluorescent', 'Motion Sensor Lighting']
      },
      {
        id: 'garage-smart',
        name: 'Smart Home & Security',
        description: 'Garage automation and security',
        products: ['Smart Garage Openers', 'Security Cameras', 'Smart Locks']
      }
    ]
  },
  {
    id: 'hallways',
    name: 'Hallways & Entryways',
    emoji: '9️⃣',
    subcategories: [
      {
        id: 'entryway-furniture',
        name: 'Entryway Furniture',
        description: 'Entryway storage and organization',
        products: ['Consoles', 'Shoe Storage', 'Coat Racks']
      },
      {
        id: 'hallway-lighting',
        name: 'Lighting Fixtures',
        description: 'Hallway and entryway lighting',
        products: ['Chandeliers', 'Wall Sconces', 'Motion-Activated Lighting']
      },
      {
        id: 'hallway-flooring',
        name: 'Flooring',
        description: 'Durable entryway flooring',
        products: ['Hardwood', 'Tile', 'Luxury Vinyl Plank', 'Carpet Runners']
      },
      {
        id: 'hallway-walls',
        name: 'Wall Coverings & Accent Features',
        description: 'Entryway wall treatments',
        products: ['Decorative Trim', 'Molding', 'Wallpaper']
      },
      {
        id: 'hallway-smart',
        name: 'Smart Home Enhancements',
        description: 'Entryway automation',
        products: ['Smart Locks', 'Doorbell Cameras', 'Motion Sensors']
      }
    ]
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Exterior Spaces',
    emoji: '🔟',
    subcategories: [
      {
        id: 'decking',
        name: 'Decking & Patio Materials',
        description: 'Outdoor surface materials',
        products: ['Wood Decking', 'Composite', 'Concrete Pavers']
      },
      {
        id: 'outdoor-kitchen',
        name: 'Outdoor Kitchens & BBQs',
        description: 'Outdoor cooking solutions',
        products: ['Grills', 'Outdoor Cabinets', 'Countertops']
      },
      {
        id: 'outdoor-lighting',
        name: 'Outdoor Lighting',
        description: 'Exterior lighting solutions',
        products: ['Pathway Lights', 'Spotlights', 'String Lights']
      },
      {
        id: 'landscaping',
        name: 'Landscaping & Hardscaping',
        description: 'Outdoor structural elements',
        products: ['Fencing', 'Pergolas', 'Garden Features']
      },
      {
        id: 'outdoor-storage',
        name: 'Outdoor Storage & Furniture',
        description: 'Outdoor living essentials',
        products: ['Sheds', 'Patio Furniture', 'Fire Pits']
      },
      {
        id: 'outdoor-smart',
        name: 'Smart Outdoor Enhancements',
        description: 'Outdoor automation',
        products: ['Smart Irrigation', 'Security Cameras', 'Wi-Fi Extenders']
      }
    ]
  }
];