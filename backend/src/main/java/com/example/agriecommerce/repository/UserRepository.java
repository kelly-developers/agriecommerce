package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt > ?1")
    long countByCreatedAtAfter(Date date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN ?1 AND ?2")
    long countByCreatedAtBetween(Date startDate, Date endDate);
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(String status);


}