package com.example.agriecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Size(max = 500)
    private String street;

    @NotBlank
    @Size(max = 100)
    private String city;

    @NotBlank
    @Size(max = 100)
    private String county;

    @Size(max = 20)
    private String postalCode;

    @Size(max = 500)
    private String additionalInfo;

    private Boolean isDefault = false;

    // Constructors, getters, and setters
    public Address() {}

    public Address(User user, String street, String city, String county) {
        this.user = user;
        this.street = street;
        this.city = city;
        this.county = county;
    }

    // Add getters and setters for all fields
}