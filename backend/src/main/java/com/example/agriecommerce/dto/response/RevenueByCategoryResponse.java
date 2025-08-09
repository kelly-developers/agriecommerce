package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RevenueByCategoryResponse {
    private String category;
    private BigDecimal revenue;
    private double percentage;
}
