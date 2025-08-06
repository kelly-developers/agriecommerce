package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByStockLessThan(Integer stock);
    long countByStockLessThan(Integer stock);
}