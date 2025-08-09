package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long newUsers;
}