package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
public class RecentOrderResponse {
    private String id;
    private BigDecimal total;
    private String status;
    private Date orderDate;
    private String customerName;
}

