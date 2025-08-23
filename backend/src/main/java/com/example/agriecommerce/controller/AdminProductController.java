package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.response.ProductResponse;
import com.example.agriecommerce.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {
    private final AdminProductService adminProductService;

    @GetMapping("/pending")
    public ResponseEntity<List<ProductResponse>> getPendingProducts() {
        return ResponseEntity.ok(adminProductService.getPendingProducts());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ProductResponse> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(adminProductService.approveProduct(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ProductResponse> rejectProduct(
            @PathVariable Long id,
            @RequestBody(required = false) RejectionRequest rejectionRequest) {
        String reason = rejectionRequest != null ? rejectionRequest.getReason() : "No reason provided";
        return ResponseEntity.ok(adminProductService.rejectProduct(id, reason));
    }

    // DTO for rejection request
    public static class RejectionRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}