package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.Order;
import com.example.agriecommerce.model.OrderStatus;
import com.example.agriecommerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByUser(User user, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("SELECT SUM(o.total) FROM Order o")
    BigDecimal sumTotalAmount();

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.orderDate > ?1")
    BigDecimal sumTotalAmountByCreatedAtAfter(Date date);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.orderDate BETWEEN ?1 AND ?2")
    BigDecimal sumTotalAmountByCreatedAtBetween(Date startDate, Date endDate);

    long countByStatus(OrderStatus status);

    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC LIMIT 10")
    List<Order> findTop10ByOrderByOrderDateDesc();
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    long countByOrderDateBetween(Date start, Date end);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    Map<OrderStatus, Long> countByStatusGroupByStatus();
}