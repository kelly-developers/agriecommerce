package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SalesTrendResponse {
    private BigDecimal totalSales;
    private long orderCount;
    private String period;
}