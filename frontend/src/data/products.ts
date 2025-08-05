import { Product } from '@/types/product';
import managuImage from '@/assets/managu.jpg';
import sukumaWikiImage from '@/assets/sukuma-wiki.jpg';
import sagaImage from '@/assets/saga.jpg';
import kundeImage from '@/assets/kunde.jpg';
import suchaImage from '@/assets/sucha.jpg';

export const products: Product[] = [
  // African Traditional Vegetables
  {
    id: 'managu-001',
    name: 'Managu (African Nightshade)',
    description: 'Traditional African leafy green vegetable rich in vitamins A and C. Known for its slightly bitter taste and high nutritional value.',
    price: 150,
    image: managuImage,
    category: 'vegetables',
    subcategory: 'african-greens',
    stock: 50,
    origin: 'Central Kenya',
    nutritionalInfo: 'High in Vitamin A, C, Iron, and Calcium',
    isOrganic: true,
    unitType: 'bunch'
  },
  {
    id: 'sukuma-wiki-001',
    name: 'Sukuma Wiki (Collard Greens)',
    description: 'The most popular leafy green in Kenya. Perfect for traditional dishes and rich in nutrients.',
    price: 100,
    image: sukumaWikiImage,
    category: 'vegetables',
    subcategory: 'african-greens',
    stock: 75,
    origin: 'Kiambu County',
    nutritionalInfo: 'Rich in Vitamin K, A, C and Folate',
    isOrganic: true,
    unitType: 'bunch'
  },
  {
    id: 'saga-001',
    name: 'Saga (Spider Plant)',
    description: 'Traditional leafy vegetable with elongated leaves. Excellent source of protein and minerals.',
    price: 120,
    image: sagaImage,
    category: 'vegetables',
    subcategory: 'african-greens',
    stock: 30,
    origin: 'Nyanza Region',
    nutritionalInfo: 'High protein content, Iron, and Calcium',
    isOrganic: true,
    unitType: 'bunch'
  },
  {
    id: 'kunde-001',
    name: 'Kunde (Cowpea Leaves)',
    description: 'Tender young leaves of the cowpea plant. Popular traditional vegetable across East Africa.',
    price: 130,
    image: kundeImage,
    category: 'vegetables',
    subcategory: 'african-greens',
    stock: 40,
    origin: 'Eastern Kenya',
    nutritionalInfo: 'Rich in Protein, Vitamin A, and Iron',
    isOrganic: true,
    unitType: 'bunch'
  },
  {
    id: 'sucha-001',
    name: 'Sucha (African Spinach)',
    description: 'Traditional spinach-like vegetable with round, tender leaves. Mild flavor and versatile in cooking.',
    price: 110,
    image: suchaImage,
    category: 'vegetables',
    subcategory: 'african-greens',
    stock: 35,
    origin: 'Coast Region',
    nutritionalInfo: 'High in Iron, Vitamin C, and Folate',
    isOrganic: true,
    unitType: 'bunch'
  },

  // Fruits
  {
    id: 'mango-001',
    name: 'Kent Mango',
    description: 'Sweet and juicy Kent mangoes from coastal Kenya. Perfect for fresh eating or making smoothies.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1605027990121-cbae9ff4f5a5?w=400',
    category: 'fruits',
    subcategory: 'tropical-fruits',
    stock: 60,
    origin: 'Kilifi County',
    nutritionalInfo: 'Rich in Vitamin C, A, and Fiber',
    isOrganic: true,
    unitType: 'piece'
  },
  {
    id: 'passion-fruit-001',
    name: 'Purple Passion Fruit',
    description: 'Aromatic passion fruits with intense flavor. Great for juices and desserts.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1571575173700-afb9492445d3?w=400',
    category: 'fruits',
    subcategory: 'tropical-fruits',
    stock: 40,
    origin: 'Central Kenya',
    nutritionalInfo: 'High in Vitamin C, A, and Antioxidants',
    isOrganic: true,
    unitType: 'kg'
  },
  {
    id: 'avocado-001',
    name: 'Hass Avocado',
    description: 'Creamy Hass avocados with rich buttery texture. Perfect for healthy meals.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1549897100-8d4f8b1b1d9c?w=400',
    category: 'fruits',
    subcategory: 'tropical-fruits',
    stock: 80,
    origin: 'Murang\'a County',
    nutritionalInfo: 'Rich in healthy fats, Potassium, and Vitamin E',
    isOrganic: true,
    unitType: 'piece'
  },

  // Seeds & Cereals
  {
    id: 'maize-seeds-001',
    name: 'Hybrid Maize Seeds',
    description: 'High-yielding hybrid maize seeds suitable for various agro-ecological zones.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    category: 'seeds',
    subcategory: 'grain-seeds',
    stock: 100,
    origin: 'Research Stations',
    nutritionalInfo: 'High protein variety for better nutrition',
    isOrganic: false,
    unitType: 'kg'
  },
  {
    id: 'bean-seeds-001',
    name: 'Common Bean Seeds',
    description: 'Drought-resistant bean varieties perfect for smallholder farmers.',
    price: 400,
    image: 'https://images.unsplash.com/photo-1529088363629-88d49f1ba583?w=400',
    category: 'seeds',
    subcategory: 'legume-seeds',
    stock: 120,
    origin: 'Agricultural Research',
    nutritionalInfo: 'High protein and fiber content',
    isOrganic: true,
    unitType: 'kg'
  },
  {
    id: 'sorghum-seeds-001',
    name: 'Sorghum Seeds',
    description: 'Drought-tolerant sorghum seeds ideal for arid and semi-arid areas.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1594736797933-d0a3e1d7ad96?w=400',
    category: 'seeds',
    subcategory: 'grain-seeds',
    stock: 90,
    origin: 'ICRISAT Kenya',
    nutritionalInfo: 'Rich in antioxidants and minerals',
    isOrganic: true,
    unitType: 'kg'
  },

  // Farm Tools
  {
    id: 'hand-hoe-001',
    name: 'Traditional Hand Hoe',
    description: 'Durable hand hoe perfect for small-scale farming and garden cultivation.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    category: 'tools',
    subcategory: 'hand-tools',
    stock: 50,
    origin: 'Local Manufacturers',
    nutritionalInfo: 'N/A',
    isOrganic: false,
    unitType: 'piece'
  },
  {
    id: 'irrigation-kit-001',
    name: 'Drip Irrigation Kit',
    description: 'Complete drip irrigation system for efficient water use in small farms.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400',
    category: 'tools',
    subcategory: 'irrigation',
    stock: 25,
    origin: 'Kenya Irrigation',
    nutritionalInfo: 'N/A',
    isOrganic: false,
    unitType: 'kit'
  },
  {
    id: 'solar-dryer-001',
    name: 'Solar Food Dryer',
    description: 'Solar-powered food dryer for preserving fruits and vegetables.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400',
    category: 'tools',
    subcategory: 'processing',
    stock: 15,
    origin: 'Solar Tech Kenya',
    nutritionalInfo: 'N/A',
    isOrganic: false,
    unitType: 'unit'
  }
];

export const categories = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    subcategories: [
      { id: 'african-greens', name: 'African Traditional Greens' },
      { id: 'exotic-vegetables', name: 'Exotic Vegetables' },
      { id: 'root-vegetables', name: 'Root Vegetables' }
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    subcategories: [
      { id: 'tropical-fruits', name: 'Tropical Fruits' },
      { id: 'citrus', name: 'Citrus Fruits' },
      { id: 'berries', name: 'African Berries' }
    ]
  },
  {
    id: 'seeds',
    name: 'Seeds & Cereals',
    subcategories: [
      { id: 'vegetable-seeds', name: 'Vegetable Seeds' },
      { id: 'grain-seeds', name: 'Grain Seeds' },
      { id: 'legume-seeds', name: 'Legume Seeds' }
    ]
  },
  {
    id: 'tools',
    name: 'Farm Tools',
    subcategories: [
      { id: 'hand-tools', name: 'Hand Tools' },
      { id: 'irrigation', name: 'Irrigation Equipment' },
      { id: 'processing', name: 'Processing Tools' }
    ]
  }
];