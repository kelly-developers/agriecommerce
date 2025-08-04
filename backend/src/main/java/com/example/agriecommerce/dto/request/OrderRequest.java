package com.example.agriecommerce.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderRequest {
    @Valid
    @NotNull
    private CustomerInfo customerInfo;

    @Valid
    @NotNull
    private DeliveryInfo deliveryInfo;

    private String paymentReference;

    @Data
    public static class CustomerInfo {
        @NotBlank
        private String firstName;

        @NotBlank
        private String lastName;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String phone;
    }

    @Data
    public static class DeliveryInfo {
        @NotBlank
        private String address;

        @NotBlank
        private String city;

        @NotBlank
        private String county;

        private String postalCode;

        private String deliveryNotes;
    }
}