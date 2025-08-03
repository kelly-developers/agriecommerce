package com.example.agriecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

//import javax.persistence.*;
//import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotBlank
    private String category;

    @NotBlank
    @Size(max = 50)
    private String unitType;

    @Min(0)
    private Integer stock;

    @Size(max = 500)
    private String imageUrl;

    private Boolean isOrganic = false;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(name = "created_at")
    private Date createdAt = new Date();

    @Column(name = "updated_at")
    private Date updatedAt = new Date();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    private User farmer;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> cartItems = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems = new HashSet<>();

    // Constructors, getters, and setters
    public Product() {}

    public Product(String name, String description, BigDecimal price, String category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }


}

//enum ProductStatus {
//    ACTIVE, INACTIVE, OUT_OF_STOCK
//}