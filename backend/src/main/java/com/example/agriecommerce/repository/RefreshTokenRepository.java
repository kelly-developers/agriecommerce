package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.RefreshToken;
import com.example.agriecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Find token by token string
    Optional<RefreshToken> findByToken(String token);

    // Find token by user ID
    Optional<RefreshToken> findByUserId(Long userId);

    // Delete all tokens for a specific user
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    // Delete token by User entity
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = :user")
    void deleteByUser(@Param("user") User user);

    // Delete token by token string
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.token = :token")
    void deleteByToken(@Param("token") String token);

    // Check if token exists for user
    boolean existsByUserId(Long userId);
}