package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductStatsResponse {
    private long totalProducts;
    private long outOfStock;
    private long lowStock;
}