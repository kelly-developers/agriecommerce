package com.example.agriecommerce.repository;

import com.example.agriecommerce.model.Address;
import com.example.agriecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);

    Optional<Address> findByIdAndUserId(Long id, Long userId);

    Optional<Address> findByUserAndIsDefault(User user, Boolean isDefault);
}