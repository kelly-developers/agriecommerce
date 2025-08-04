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

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByUser(User user, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("SELECT SUM(o.total) FROM Order o")
    BigDecimal sumTotalAmount();

    long countByStatus(OrderStatus status);
}