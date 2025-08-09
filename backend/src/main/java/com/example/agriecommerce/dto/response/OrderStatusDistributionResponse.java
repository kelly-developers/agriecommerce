package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderStatusDistributionResponse {
    private long pending;
    private long processing;
    private long shipped;
    private long delivered;
    private long cancelled;
}