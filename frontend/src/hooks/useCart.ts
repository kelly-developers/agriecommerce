import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '@/types/product';
import { cartAPI, productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from API when user is logged in
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await cartAPI.get();
        // Fetch full product details for each item
        const itemsWithProducts = await Promise.all(
          cartData.items.map(async (item: any) => {
            const product = await productsAPI.getById(item.productId);
            return {
              product,
              quantity: item.quantity
            };
          })
        );
        setItems(itemsWithProducts);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

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

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (user) {
      try {
        await cartAPI.addItem(product.id, quantity);
        // Update local state with the new product
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
      } catch (error) {
        console.error('Failed to add to cart:', error);
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
        setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
      } catch (error) {
        console.error('Failed to remove from cart:', error);
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
        setItems(currentItems =>
          currentItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error('Failed to update cart:', error);
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