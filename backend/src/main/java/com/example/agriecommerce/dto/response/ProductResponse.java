package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String unitType;
    private Integer stock;
    private String imageUrl;
    private Boolean isOrganic;
    private long totalProducts;
    private long outOfStock;
    private long lowStock;
}