package com.example.agriecommerce.dto.request;

import com.example.agriecommerce.model.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull
    private String orderId;

    @NotNull
    private PaymentMethod paymentMethod;

    private String phoneNumber;
    private String accountReference;
    private String transactionDesc;
}