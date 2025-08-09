package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PopularProductResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private int timesOrdered;
}
