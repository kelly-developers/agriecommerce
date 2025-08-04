package com.example.agriecommerce.dto.response;

import com.example.agriecommerce.model.CartItem;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private Long id;
    private Long userId;
    private List<CartItem> items;
    private Integer totalItems;
    private BigDecimal totalPrice;
}