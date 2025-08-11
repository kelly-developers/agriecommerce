package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.request.FarmerProductRequest;
import com.example.agriecommerce.dto.response.ProductResponse;
import com.example.agriecommerce.security.UserPrincipal;
import com.example.agriecommerce.service.FarmerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/farmer/products")
@RequiredArgsConstructor
public class FarmerController {
    private final FarmerService farmerService;

    @PostMapping
    public ResponseEntity<ProductResponse> submitProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FarmerProductRequest productRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(farmerService.submitProduct(userId, productRequest));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(farmerService.getMyProducts(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody FarmerProductRequest productRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(farmerService.updateProduct(userId, id, productRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = ((UserPrincipal) userDetails).getId();
        farmerService.deleteProduct(userId, id);
        return ResponseEntity.noContent().build();
    }
}