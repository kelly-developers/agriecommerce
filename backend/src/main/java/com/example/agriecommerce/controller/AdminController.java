package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.response.AdminStatsResponse;
import com.example.agriecommerce.repository.OrderRepository;
import com.example.agriecommerce.repository.ProductRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long lowStockProducts = productRepository.countByStockLessThan(10);

        BigDecimal totalRevenue = orderRepository.sumTotalAmount() != null ?
                orderRepository.sumTotalAmount() : BigDecimal.ZERO;

        AdminStatsResponse response = AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .lowStockProducts(lowStockProducts)
                .build();

        return ResponseEntity.ok(response);
    }
}