package com.example.agriecommerce.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Size(max = 255)
    private String transactionId;

    @Size(max = 255)
    private String merchantRequestId;

    @Size(max = 255)
    private String checkoutRequestId;

    @Size(max = 255)
    private String receiptNumber;

    @Column(name = "payment_date")
    private Date paymentDate = new Date();

    // Constructors, getters, and setters
    public Payment() {}

    public Payment(Order order, User user, BigDecimal amount, PaymentMethod paymentMethod) {
        this.order = order;
        this.user = user;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    // Getters and setters
    // ...
}



