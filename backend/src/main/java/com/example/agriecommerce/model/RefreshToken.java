package com.example.agriecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_tokens",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_refresh_token_user",
                columnNames = {"user_id"}))
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(nullable = false, name = "expiry_date")
    private Instant expiryDate;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Version
    private Integer version;

    // Business methods
    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now());
    }

    @PrePersist
    @PreUpdate
    private void validate() {
        if (expiryDate.isBefore(Instant.now())) {
            throw new IllegalStateException("Expiry date must be in the future");
        }
    }
}