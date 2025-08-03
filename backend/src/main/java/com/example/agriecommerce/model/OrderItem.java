package com.example.agriecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

//import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @NotBlank
    @Size(max = 255)
    private String productName;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal productPrice;

    @Min(1)
    private Integer quantity;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal totalPrice;

    // Constructors, getters, and setters
    public OrderItem() {}

    public OrderItem(Order order, Product product, Integer quantity) {
        this.order = order;
        this.product = product;
        this.productName = product.getName();
        this.productPrice = product.getPrice();
        this.quantity = quantity;
        this.totalPrice = productPrice.multiply(BigDecimal.valueOf(quantity));
    }

    // Getters and setters
    // ...
}