export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  stock: number;
  origin: string;
  nutritionalInfo?: string;
  isOrganic: boolean;
  unitType: 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit';
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