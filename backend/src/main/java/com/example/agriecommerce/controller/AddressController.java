package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.request.AddressRequest;
import com.example.agriecommerce.dto.response.AddressResponse;
import com.example.agriecommerce.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getUserAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(addressService.getUserAddresses(userId));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddressRequest addressRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(addressService.createAddress(userId, addressRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest addressRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(addressService.updateAddress(userId, id, addressRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = ((UserPrincipal) userDetails).getId();
        addressService.deleteAddress(userId, id);
        return ResponseEntity.noContent().build();
    }
}