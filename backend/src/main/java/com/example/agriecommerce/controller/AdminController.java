package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.response.*;
import com.example.agriecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<AdminStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<RecentOrderResponse>> getRecentOrders() {
        return ResponseEntity.ok(adminService.getRecentOrders());
    }

    @GetMapping("/popular-products")
    public ResponseEntity<List<PopularProductResponse>> getPopularProducts() {
        return ResponseEntity.ok(adminService.getPopularProducts());
    }

    @GetMapping("/sales-trend")
    public ResponseEntity<SalesTrendResponse> getSalesTrend(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(adminService.getSalesTrend(period));
    }

    @GetMapping("/user-stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        return ResponseEntity.ok(adminService.getUserStats());
    }

    @GetMapping("/product-stats")
    public ResponseEntity<ProductStatsResponse> getProductStats() {
        return ResponseEntity.ok(adminService.getProductStats());
    }

    @GetMapping("/revenue-by-category")
    public ResponseEntity<List<RevenueByCategoryResponse>> getRevenueByCategory() {
        return ResponseEntity.ok(adminService.getRevenueByCategory());
    }

    @GetMapping("/order-status-distribution")
    public ResponseEntity<OrderStatusDistributionResponse> getOrderStatusDistribution() {
        return ResponseEntity.ok(adminService.getOrderStatusDistribution());
    }
}