import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Product, CartItem, CustomerInfo, DeliveryInfo } from '@/types/product';

// Use a direct URL or window.env for browser environment
const API_BASE_URL = typeof window !== 'undefined' 
  ? (window as any).env?.NEXT_PUBLIC_API_BASE_URL || 'https://agriecommerce.onrender.com/api/v1'
  : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://agriecommerce.onrender.com/api/v1';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions if using them
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          throw new Error('Not in browser environment');
        }
        
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Attempt to refresh tokens
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Store new tokens
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      // Optionally redirect or show error message
    }
    
    return Promise.reject(error);
  }
);

// Type definitions
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

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
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    // Store tokens upon successful login
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await api.post('/auth/logout', { refreshToken });
        }
      }
    } finally {
      // Always clear tokens on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    }
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    if (typeof window === 'undefined') {
      throw new Error('Not in browser environment');
    }
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await api.post('/auth/refresh', { refreshToken });
    // Update stored tokens
    localStorage.setItem('authToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  adminCreateUser: async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { 
    category?: string; 
    page?: number; 
    size?: number;
    search?: string;
    sort?: string;
  }) => {
    const response = await api.get('/products', { params });
    
    // Handle different response formats
    let productsData = response.data;
    
    // If response has a products array
    if (productsData && Array.isArray(productsData.products)) {
      productsData = productsData.products;
    }
    // If response is paginated with content
    else if (productsData && Array.isArray(productsData.content)) {
      productsData = productsData.content;
    }
    // If response is already an array
    else if (Array.isArray(productsData)) {
      productsData = productsData;
    }
    // Fallback to empty array
    else {
      productsData = [];
    }
    
    return productsData;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (productData: ProductRequest) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  update: async (id: string, productData: Partial<ProductRequest>) => {
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

  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  create: async (name: string) => {
    const response = await api.post('/categories', { name });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

// Cart API
export const cartAPI = {
  get: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addItem: async (productId: string, quantity: number) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },
  
  updateItem: async (productId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },
  
  removeItem: async (productId: string) => {
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
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getAll: async (params?: { 
    page?: number; 
    size?: number;
    status?: string;
  }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/admin/${id}/status`, { status });
    return response.data;
  },
  
  getAllAdmin: async (params?: { 
    page?: number; 
    size?: number;
    status?: string;
    userId?: string;
  }) => {
    const response = await api.get('/orders/admin', { params });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  getAllAdmin: async (params?: { 
    page?: number; 
    size?: number;
    role?: string;
    status?: string;
  }) => {
    const response = await api.get('/users/admin', { params });
    return response.data;
  },
  
  updateUserStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },
};

// Addresses API
export const addressesAPI = {
  getAll: async (): Promise<AddressRequest[]> => {
    const response = await api.get('/addresses');
    return response.data;
  },
  
  create: async (addressData: AddressRequest) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },
  
  update: async (id: string, addressData: Partial<AddressRequest>) => {
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
  initiatePayment: async (amount: number, currency: string = 'KES') => {
    const response = await api.post('/payments/initiate', { amount, currency });
    return response.data;
  },
  
  verifyPayment: async (paymentId: string) => {
    const response = await api.get(`/payments/verify/${paymentId}`);
    return response.data;
  },
  
  initiateMpesaPayment: async (paymentData: {
    amount: number;
    phoneNumber: string;
    accountReference?: string;
    transactionDesc?: string;
  }) => {
    const response = await api.post('/payments/mpesa/stk-push', paymentData);
    return response.data;
  },
  
  checkMpesaPaymentStatus: async (checkoutRequestId: string) => {
    const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
    return response.data;
  }
};

// Mpesa API - Added this new export to match the import in MpesaPayment.tsx
export const mpesaAPI = {
  initiatePayment: async (paymentData: {
    amount: number;
    phoneNumber: string;
    accountReference?: string;
    transactionDesc?: string;
  }) => {
    const response = await api.post('/payments/mpesa/stk-push', paymentData);
    return response.data;
  },
  
  checkPaymentStatus: async (checkoutRequestId: string) => {
    const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
    return response.data;
  }
};

// Farmers API - UPDATED WITH UPLOADIMAGE METHOD
export const farmersAPI = {
  submitProduct: async (productData: any) => {
    try {
      const response = await api.post('/farmer/products', productData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getMyProducts: async () => {
    const response = await api.get('/farmer/products');
    return response.data;
  },
  
  updateProduct: async (id: string, productData: Partial<ProductRequest>) => {
    const response = await api.put(`/farmer/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/farmer/products/${id}`);
    return response.data;
  },

  // ADDED THE MISSING UPLOADIMAGE METHOD - Using the existing products upload endpoint
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/analytics/dashboard-stats');
    return response.data;
  },
  
  getRecentOrders: async (limit: number = 5) => {
    const response = await api.get('/admin/analytics/recent-orders', {
      params: { limit }
    });
    return response.data;
  },
  
  getPopularProducts: async (limit: number = 5) => {
    const response = await api.get('/admin/analytics/popular-products', {
      params: { limit }
    });
    return response.data;
  },
  
  getSalesTrend: async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    const response = await api.get('/admin/analytics/sales-trend', {
      params: { period }
    });
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
  },

    getPendingProducts: async (): Promise<Product[]> => {
    const response = await api.get('/admin/products/pending');
    return response.data;
  },
  
  approveProduct: async (id: string): Promise<Product> => {
    const response = await api.post(`/admin/products/${id}/approve`);
    return response.data;
  },
  
  rejectProduct: async (id: string, reason: string): Promise<Product> => {
    const response = await api.post(`/admin/products/${id}/reject`, { reason });
    return response.data;
  }
};

export default api;