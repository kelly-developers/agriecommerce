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
        public String firstName;
        public String lastName;
        public String email;
        public String phone;

        public CustomerInfo() {}

        public CustomerInfo(String firstName, String lastName, String email, String phone) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
        }
    }

    @Data
    @Builder
    public static class DeliveryInfo {
        public String address;
        public String city;
        public String county;
        public String postalCode;
        public String deliveryNotes;

        public DeliveryInfo() {}

        public DeliveryInfo(String address, String city, String county, String postalCode, String deliveryNotes) {
            this.address = address;
            this.city = city;
            this.county = county;
            this.postalCode = postalCode;
            this.deliveryNotes = deliveryNotes;
        }
    }

    @Data
    @Builder
    public static class OrderItem {
        public Long productId;
        public String productName;
        public BigDecimal productPrice;
        public Integer quantity;
        public BigDecimal totalPrice;

        public OrderItem() {}

        public OrderItem(Long productId, String productName, BigDecimal productPrice, Integer quantity, BigDecimal totalPrice) {
            this.productId = productId;
            this.productName = productName;
            this.productPrice = productPrice;
            this.quantity = quantity;
            this.totalPrice = totalPrice;
        }
    }
}