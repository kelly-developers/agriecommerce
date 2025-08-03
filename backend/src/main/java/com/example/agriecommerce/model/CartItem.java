package com.example.agriecommerce.model;

//import javax.persistence.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.util.Date;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Min(1)
    private Integer quantity;

    @Column(name = "created_at")
    private Date createdAt = new Date();

    // Constructors, getters, and setters
    public CartItem() {}

    public CartItem(Cart cart, Product product, Integer quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters and setters
    // ...
}