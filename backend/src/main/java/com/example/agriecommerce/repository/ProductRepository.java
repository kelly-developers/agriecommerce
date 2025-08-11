package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByStockLessThan(Integer stock);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock < ?1")
    long countByStockLessThan(Integer stock);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock = ?1")
    long countByStock(Integer stock);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.createdAt > ?1")
    long countByCreatedAtAfter(Date date);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.createdAt BETWEEN ?1 AND ?2")
    long countByCreatedAtBetween(Date startDate, Date endDate);

    @Query("SELECT p FROM Product p LEFT JOIN p.orderItems oi GROUP BY p.id ORDER BY COUNT(oi) DESC LIMIT 5")
    List<Product> findTop5PopularProducts();

    @Query("SELECT p.category, SUM(oi.totalPrice) FROM Product p JOIN p.orderItems oi GROUP BY p.category")
    List<Object[]> sumRevenueByCategory();

    List<Product> findByFarmerId(Long farmerId);

    Optional<Product> findByIdAndFarmerId(Long id, Long farmerId);
}