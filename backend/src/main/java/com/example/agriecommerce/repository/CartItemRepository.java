package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.Cart;
import com.example.agriecommerce.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteByCart(Cart cart);  // Changed from deleteAllByCart to deleteByCart
}