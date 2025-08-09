package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.response.*;
import com.example.agriecommerce.model.OrderStatus;
import com.example.agriecommerce.repository.OrderRepository;
import com.example.agriecommerce.repository.ProductRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminStatsResponse getDashboardStats() {
        // Basic counts
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long lowStockProducts = productRepository.countByStockLessThan(10);

        // Revenue calculation
        BigDecimal totalRevenue = orderRepository.sumTotalAmount() != null ?
                orderRepository.sumTotalAmount() : BigDecimal.ZERO;

        // Monthly growth calculations
        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);

        Date startOfCurrentMonth = Date.from(now.withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date startOfLastMonth = Date.from(lastMonth.withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfLastMonth = Date.from(lastMonth.withDayOfMonth(lastMonth.lengthOfMonth()).atTime(23, 59, 59)
                .atZone(ZoneId.systemDefault()).toInstant());

        // Product growth
        long currentMonthProducts = productRepository.countByCreatedAtAfter(startOfCurrentMonth);
        long lastMonthProducts = productRepository.countByCreatedAtBetween(startOfLastMonth, endOfLastMonth);
        double productGrowth = calculateGrowthPercentage(currentMonthProducts, lastMonthProducts);

        // Order growth
        BigDecimal currentMonthRevenue = orderRepository.sumTotalAmountByCreatedAtAfter(startOfCurrentMonth) != null ?
                orderRepository.sumTotalAmountByCreatedAtAfter(startOfCurrentMonth) : BigDecimal.ZERO;
        BigDecimal lastMonthRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(startOfLastMonth, endOfLastMonth) != null ?
                orderRepository.sumTotalAmountByCreatedAtBetween(startOfLastMonth, endOfLastMonth) : BigDecimal.ZERO;
        double revenueGrowth = calculateRevenueGrowthPercentage(currentMonthRevenue, lastMonthRevenue);

        // User growth
        long currentMonthUsers = userRepository.countByCreatedAtAfter(startOfCurrentMonth);
        long lastMonthUsers = userRepository.countByCreatedAtBetween(startOfLastMonth, endOfLastMonth);
        double userGrowth = calculateGrowthPercentage(currentMonthUsers, lastMonthUsers);

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .lowStockProducts(lowStockProducts)
                .productGrowth(productGrowth)
                .revenueGrowth(revenueGrowth)
                .userGrowth(userGrowth)
                .build();
    }

    public List<RecentOrderResponse> getRecentOrders() {
        return orderRepository.findTop10ByOrderByOrderDateDesc()
                .stream()
                .map(order -> RecentOrderResponse.builder()
                        .id(order.getId())
                        .total(order.getTotal())
                        .status(order.getStatus().name())
                        .orderDate(order.getOrderDate())
                        .customerName(order.getCustomerFirstName() + " " + order.getCustomerLastName())
                        .build())
                .collect(Collectors.toList());
    }

    public List<PopularProductResponse> getPopularProducts() {
        return productRepository.findTop5PopularProducts()
                .stream()
                .map(product -> PopularProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .stock(product.getStock())
                        .timesOrdered(product.getOrderItems().size())
                        .build())
                .collect(Collectors.toList());
    }

    public SalesTrendResponse getSalesTrend(String period) {
        LocalDate now = LocalDate.now();
        Date startDate = calculateStartDate(period, now);
        Date endDate = Date.from(now.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        BigDecimal totalSales = orderRepository.sumTotalAmountByCreatedAtBetween(startDate, endDate);
        long orderCount = orderRepository.countByOrderDateBetween(startDate, endDate);

        return SalesTrendResponse.builder()
                .totalSales(totalSales != null ? totalSales : BigDecimal.ZERO)
                .orderCount(orderCount)
                .period(period)
                .build();
    }

    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus("ACTIVE");
        long newUsers = userRepository.countByCreatedAtAfter(
                Date.from(LocalDate.now().minusDays(7).atStartOfDay(ZoneId.systemDefault()).toInstant()));

        return UserStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .newUsers(newUsers)
                .build();
    }

    public ProductStatsResponse getProductStats() {
        long totalProducts = productRepository.count();
        long outOfStock = productRepository.countByStock(0);
        long lowStock = productRepository.countByStockLessThan(10);

        return ProductStatsResponse.builder()
                .totalProducts(totalProducts)
                .outOfStock(outOfStock)
                .lowStock(lowStock)
                .build();
    }

    public List<RevenueByCategoryResponse> getRevenueByCategory() {
        List<Object[]> revenueData = productRepository.sumRevenueByCategory();
        BigDecimal totalRevenue = revenueData.stream()
                .map(arr -> (BigDecimal) arr[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return revenueData.stream()
                .map(arr -> {
                    String category = (String) arr[0];
                    BigDecimal revenue = (BigDecimal) arr[1];
                    double percentage = totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                            revenue.divide(totalRevenue, 4, RoundingMode.HALF_UP)
                                    .multiply(BigDecimal.valueOf(100))
                                    .doubleValue() : 0;

                    return RevenueByCategoryResponse.builder()
                            .category(category)
                            .revenue(revenue)
                            .percentage(percentage)
                            .build();
                })
                .sorted(Comparator.comparing(RevenueByCategoryResponse::getRevenue).reversed())
                .collect(Collectors.toList());
    }

    public OrderStatusDistributionResponse getOrderStatusDistribution() {
        Map<OrderStatus, Long> statusCounts = orderRepository.countByStatusGroupByStatus();

        return OrderStatusDistributionResponse.builder()
                .pending(statusCounts.getOrDefault(OrderStatus.PENDING, 0L))
                .processing(statusCounts.getOrDefault(OrderStatus.PROCESSING, 0L))
                .shipped(statusCounts.getOrDefault(OrderStatus.SHIPPED, 0L))
                .delivered(statusCounts.getOrDefault(OrderStatus.DELIVERED, 0L))
                .cancelled(statusCounts.getOrDefault(OrderStatus.CANCELLED, 0L))
                .build();
    }

    // Helper methods
    private double calculateGrowthPercentage(long currentValue, long previousValue) {
        return previousValue > 0 ? ((currentValue - previousValue) * 100.0 / previousValue) : 0;
    }

    private double calculateRevenueGrowthPercentage(BigDecimal currentRevenue, BigDecimal previousRevenue) {
        return previousRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                currentRevenue.subtract(previousRevenue)
                        .divide(previousRevenue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue() : 0;
    }

    private double calculatePercentage(BigDecimal value, BigDecimal total) {
        return total.compareTo(BigDecimal.ZERO) > 0 ?
                value.divide(total, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue() : 0;
    }

    private Date calculateStartDate(String period, LocalDate now) {
        switch (period.toLowerCase()) {
            case "week":
                return Date.from(now.minusWeeks(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            case "month":
                return Date.from(now.minusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            case "year":
                return Date.from(now.minusYears(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            case "day":
                return Date.from(now.minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            default:
                return Date.from(now.minusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
    }
}