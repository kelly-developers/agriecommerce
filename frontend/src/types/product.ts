export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // Changed from 'image' to 'imageUrl'
  category: string;
  subcategory?: string;
  stock: number;
  origin?: string;
  nutritionalInfo?: string;
  isOrganic: boolean;
  unitType: 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit';
  status?: string;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  farmerId?: string;
  farmerName?: string;
  totalProducts?: number;
  outOfStock?: number;
  lowStock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  deliveryInfo: DeliveryInfo;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderDate: Date;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  county: string;
  postalCode: string;
  deliveryNotes?: string;
}