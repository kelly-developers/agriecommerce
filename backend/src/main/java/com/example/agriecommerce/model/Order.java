package com.example.agriecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Size(max = 100)
    private String customerFirstName;

    @NotBlank
    @Size(max = 100)
    private String customerLastName;

    @NotBlank
    @Email
    @Size(max = 255)
    private String customerEmail;

    @NotBlank
    @Size(max = 20)
    private String customerPhone;

    @NotBlank
    @Size(max = 500)
    private String deliveryAddress;

    @NotBlank
    @Size(max = 100)
    private String deliveryCity;

    @NotBlank
    @Size(max = 100)
    private String deliveryCounty;

    @Size(max = 20)
    private String deliveryPostalCode;

    @Size(max = 500)
    private String deliveryNotes;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal subtotal;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal deliveryFee;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Size(max = 255)
    private String paymentReference;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems = new HashSet<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    @Column(name = "order_date")
    private Date orderDate = new Date();

    // Constructors
    public Order() {}

    public Order(String id, User user, BigDecimal subtotal, BigDecimal deliveryFee, BigDecimal total) {
        this.id = id;
        this.user = user;
        this.subtotal = subtotal;
        this.deliveryFee = deliveryFee;
        this.total = total;
    }

    // Custom methods
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    public void removeOrderItem(OrderItem orderItem) {
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
    }
}