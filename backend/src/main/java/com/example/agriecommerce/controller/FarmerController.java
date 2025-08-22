package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.request.FarmerProductRequest;
import com.example.agriecommerce.dto.response.ProductResponse;
import com.example.agriecommerce.security.UserPrincipal;
import com.example.agriecommerce.service.FarmerService;
import com.example.agriecommerce.service.ImageStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/farmer")
@RequiredArgsConstructor
public class FarmerController {
    private final FarmerService farmerService;
    private final ImageStorageService imageStorageService;

    // Add this image upload endpoint
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("image") MultipartFile file) {
        try {
            // Verify the user is a farmer
            Long userId = ((UserPrincipal) userDetails).getId();
            // You might want to add farmer verification logic here

            String imageUrl = imageStorageService.store(file);
            return ResponseEntity.ok().body(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Image upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> submitProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FarmerProductRequest productRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(farmerService.submitProduct(userId, productRequest));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(farmerService.getMyProducts(userId));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody FarmerProductRequest productRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(farmerService.updateProduct(userId, id, productRequest));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = ((UserPrincipal) userDetails).getId();
        farmerService.deleteProduct(userId, id);
        return ResponseEntity.noContent().build();
    }
}