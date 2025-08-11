package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String category;
    private String subcategory;
    private Integer stock;
    private String origin;
    private String nutritionalInfo;
    private Boolean isOrganic;
    private String unitType;
    private String status;
    private String rejectionReason;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private Long farmerId;
    private String farmerName;

    // Additional fields if needed
    private long totalProducts;
    private long outOfStock;
    private long lowStock;
}