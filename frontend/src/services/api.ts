import axios from 'axios';
import { Product, CartItem, CustomerInfo, DeliveryInfo } from '@/types/product';

const API_BASE_URL = process.env.BACKEND_URL || 'https://agriecommerce.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      console.error('Unauthorized access - please login again');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Forbidden - check your permissions');
      // Optionally redirect or show error message
    }
    return Promise.reject(error);
  }
);

// Type definitions
interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  unitType: string;
  stock: number;
  imageUrl?: string;
  isOrganic?: boolean;
  subcategory?: string;
  origin?: string;
  nutritionalInfo?: string;
}

interface FarmerProductRequest extends ProductRequest {
  // Additional farmer-specific fields if any
}

interface AddressRequest {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface ImageUploadResponse {
  imageUrl: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getAll: async (params?: { category?: string; page?: number; size?: number }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (productData: ProductRequest) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  update: async (id: string, productData: ProductRequest) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data as ImageUploadResponse;
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addItem: async (productId: number, quantity: number) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },
  
  updateItem: async (productId: number, quantity: number) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },
  
  removeItem: async (productId: number) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },
  
  clear: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: {
    customerInfo: CustomerInfo;
    deliveryInfo: DeliveryInfo;
    paymentReference: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getUserOrders: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  getAllAdmin: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/orders/admin', { params });
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/admin/${id}/status`, {}, { params: { status } });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  getAllAdmin: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  
  updateUserStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/users/${id}/status`, {}, { params: { status } });
    return response.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/admin/users/${id}/role`, {}, { params: { role } });
    return response.data;
  }
};

// Addresses API
export const addressesAPI = {
  getAll: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },
  
  create: async (addressData: AddressRequest) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },
  
  update: async (id: string, addressData: AddressRequest) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  processPayment: async (paymentData: {
    amount: number;
    paymentMethod: string;
    paymentDetails: any;
  }) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  
  getPaymentStatus: async (transactionId: string) => {
    const response = await api.get(`/payments/status/${transactionId}`);
    return response.data;
  },
  
  initiateMpesaPayment: async (paymentData: {
    amount: number;
    phoneNumber: string;
  }) => {
    const response = await api.post('/payments/mpesa/stk-push', paymentData);
    return response.data;
  },
  
  checkMpesaPaymentStatus: async (checkoutRequestId: string) => {
    const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
    return response.data;
  }
};

// Farmers API
export const farmersAPI = {
  submitProduct: async (productData: FarmerProductRequest) => {
    const response = await api.post('/farmer/products', productData);
    return response.data;
  },
  
  getMyProducts: async () => {
    const response = await api.get('/farmer/products');
    return response.data;
  },
  
  updateProduct: async (id: string, productData: FarmerProductRequest) => {
    const response = await api.put(`/farmer/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/farmer/products/${id}`);
    return response.data;
  }
};

// Admin Analytics API
export const adminAnalyticsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/analytics/dashboard-stats');
    return response.data;
  },
  getRecentOrders: async () => {
    const response = await api.get('/admin/analytics/recent-orders');
    return response.data;
  },
  getPopularProducts: async () => {
    const response = await api.get('/admin/analytics/popular-products');
    return response.data;
  },
  getSalesTrend: async (period: string) => {
    const response = await api.get(`/admin/analytics/sales-trend?period=${period}`);
    return response.data;
  },
  getUserStats: async () => {
    const response = await api.get('/admin/analytics/user-stats');
    return response.data;
  },
  getProductStats: async () => {
    const response = await api.get('/admin/analytics/product-stats');
    return response.data;
  },
  getRevenueByCategory: async () => {
    const response = await api.get('/admin/analytics/revenue-by-category');
    return response.data;
  },
  getOrderStatusDistribution: async () => {
    const response = await api.get('/admin/analytics/order-status-distribution');
    return response.data;
  }
};

export default api;