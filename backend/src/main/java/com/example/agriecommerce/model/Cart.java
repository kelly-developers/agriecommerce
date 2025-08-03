package com.example.agriecommerce.model;

import jakarta.persistence.*;

//import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> cartItems = new HashSet<>();

    @Column(name = "created_at")
    private Date createdAt = new Date();

    @Column(name = "updated_at")
    private Date updatedAt = new Date();

    // Constructors, getters, and setters
    public Cart() {}

    public Cart(User user) {
        this.user = user;
    }

    // Getters and setters
    // ...
}