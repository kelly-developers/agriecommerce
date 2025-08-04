package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.OrderRequest;
import com.example.agriecommerce.dto.response.OrderResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.*;
import com.example.agriecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest orderRequest) {
        CartResponse cart = cartService.getCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create order with empty cart");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Order order = new Order();
        order.setId("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        order.setCustomerFirstName(orderRequest.getCustomerInfo().getFirstName());
        order.setCustomerLastName(orderRequest.getCustomerInfo().getLastName());
        order.setCustomerEmail(orderRequest.getCustomerInfo().getEmail());
        order.setCustomerPhone(orderRequest.getCustomerInfo().getPhone());
        order.setDeliveryAddress(orderRequest.getDeliveryInfo().getAddress());
        order.setDeliveryCity(orderRequest.getDeliveryInfo().getCity());
        order.setDeliveryCounty(orderRequest.getDeliveryInfo().getCounty());
        order.setDeliveryPostalCode(orderRequest.getDeliveryInfo().getPostalCode());
        order.setDeliveryNotes(orderRequest.getDeliveryInfo().getDeliveryNotes());
        order.setSubtotal(cart.getTotalPrice());
        order.setDeliveryFee(BigDecimal.valueOf(200)); // Fixed delivery fee for now
        order.setTotal(order.getSubtotal().add(order.getDeliveryFee()));
        order.setPaymentReference(orderRequest.getPaymentReference());
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        // Convert cart items to order items
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setProductPrice(cartItem.getProduct().getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItemRepository.save(orderItem);

            // Update product stock
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Clear the cart after order is placed
        cartService.clearCart(userId);

        return mapToOrderResponse(savedOrder);
    }

    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(this::mapToOrderResponse);
    }

    public OrderResponse getOrderDetails(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return mapToOrderResponse(order);
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::mapToOrderResponse);
    }

    public OrderResponse updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .customerInfo(new OrderResponse.CustomerInfo(
                        order.getCustomerFirstName(),
                        order.getCustomerLastName(),
                        order.getCustomerEmail(),
                        order.getCustomerPhone()
                ))
                .deliveryInfo(new OrderResponse.DeliveryInfo(
                        order.getDeliveryAddress(),
                        order.getDeliveryCity(),
                        order.getDeliveryCounty(),
                        order.getDeliveryPostalCode(),
                        order.getDeliveryNotes()
                ))
                .items(orderItemRepository.findByOrder(order).stream()
                        .map(item -> new OrderResponse.OrderItem(
                                item.getProduct().getId(),
                                item.getProductName(),
                                item.getProductPrice(),
                                item.getQuantity(),
                                item.getTotalPrice()
                        ))
                        .collect(Collectors.toList()))
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .total(order.getTotal())
                .status(order.getStatus())
                .paymentReference(order.getPaymentReference())
                .orderDate(order.getOrderDate())
                .build();
    }
}