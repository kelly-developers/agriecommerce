import axios from 'axios';
import { Product, CartItem, CustomerInfo, DeliveryInfo } from '@/types/product';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
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
  
  create: async (productData: FormData) => {
    const response = await api.post('/admin/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  update: async (id: string, productData: FormData) => {
    const response = await api.put(`/admin/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
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
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getAll: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },
  
  getAllAdmin: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/admin/orders', { params });
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
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },
};

// Addresses API
export const addressesAPI = {
  getAll: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },
  
  create: async (addressData: any) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },
  
  update: async (id: string, addressData: any) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};

// M-Pesa Payment API
export const mpesaAPI = {
  initiate: async (paymentData: {
    amount: number;
    phoneNumber: string;
    accountReference: string;
    transactionDesc: string;
  }) => {
    const response = await api.post('/payments/mpesa/stk-push', paymentData);
    return response.data;
  },
  
  checkStatus: async (checkoutRequestId: string) => {
    const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
    return response.data;
  },
};

export default api;