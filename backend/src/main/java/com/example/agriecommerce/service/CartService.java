package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.CartItemRequest;
import com.example.agriecommerce.dto.response.CartResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.*;
import com.example.agriecommerce.repository.CartItemRepository;
import com.example.agriecommerce.repository.CartRepository;
import com.example.agriecommerce.repository.ProductRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(Long userId, CartItemRequest cartItemRequest) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", cartItemRequest.getProductId()));

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItemRequest.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(cartItemRequest.getQuantity());
            cartItemRepository.save(newItem);
        }

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "productId", productId));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItemFromCart(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "productId", productId));

        cartItemRepository.delete(cartItem);
        return mapToCartResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteAllByCart(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        BigDecimal totalPrice = cart.getCartItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(cart.getCartItems())
                .totalItems(cart.getCartItems().size())
                .totalPrice(totalPrice)
                .build();
    }
}