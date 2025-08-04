package com.example.agriecommerce.dto.response;

import com.example.agriecommerce.model.PaymentMethod;
import com.example.agriecommerce.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private String orderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private String receiptNumber;
    private Date paymentDate;
}