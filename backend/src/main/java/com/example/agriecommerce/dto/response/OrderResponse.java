package com.example.agriecommerce.dto.response;

import com.example.agriecommerce.model.OrderStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String id;
    private CustomerInfo customerInfo;
    private DeliveryInfo deliveryInfo;
    private List<OrderItem> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal total;
    private OrderStatus status;
    private String paymentReference;
    private Date orderDate;

    @Data
    @Builder
    public static class CustomerInfo {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
    }

    @Data
    @Builder
    public static class DeliveryInfo {
        private String address;
        private String city;
        private String county;
        private String postalCode;
        private String deliveryNotes;
    }

    @Data
    @Builder
    public static class OrderItem {
        private Long productId;
        private String productName;
        private BigDecimal productPrice;
        private Integer quantity;
        private BigDecimal totalPrice;
    }
}