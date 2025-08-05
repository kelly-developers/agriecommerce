import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '@/types/product';
import { cartAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from API when user is logged in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    }
  }, [user]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(items));
    }
  }, [items, user]);

  const loadCart = async () => {
    try {
      const cartData = await cartAPI.get();
      setItems(cartData.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (user) {
      try {
        await cartAPI.addItem(product.id, quantity);
        await loadCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
        // Fallback to local state
        setItems(currentItems => {
          const existingItem = currentItems.find(item => item.product.id === product.id);
          if (existingItem) {
            return currentItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...currentItems, { product, quantity }];
        });
      }
    } else {
      // Guest user - use local state
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.product.id === product.id);
        if (existingItem) {
          return currentItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...currentItems, { product, quantity }];
      });
    }
  }, [user]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (user) {
      try {
        await cartAPI.removeItem(productId);
        await loadCart();
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
      }
    } else {
      setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (user) {
      try {
        await cartAPI.updateItem(productId, quantity);
        await loadCart();
      } catch (error) {
        console.error('Failed to update cart:', error);
        setItems(currentItems =>
          currentItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } else {
      setItems(currentItems =>
        currentItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [user, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await cartAPI.clear();
        setItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [user]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice: getTotalPrice(),
    totalItems: getTotalItems()
  };
};