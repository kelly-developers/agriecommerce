package com.example.agriecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

//import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NotBlank
    private String token;

    private Instant expiryDate;

    // Constructors, getters, and setters
    public RefreshToken() {}

    public RefreshToken(User user, String token, Instant expiryDate) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    // Getters and setters
    // ...
}