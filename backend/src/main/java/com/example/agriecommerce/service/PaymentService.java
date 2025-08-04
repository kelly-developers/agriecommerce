package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.PaymentRequest;
import com.example.agriecommerce.dto.response.PaymentResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.*;
import com.example.agriecommerce.repository.OrderRepository;
import com.example.agriecommerce.repository.PaymentRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public PaymentResponse processPayment(Long userId, PaymentRequest paymentRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", paymentRequest.getOrderId()));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setUser(user);
        payment.setAmount(order.getTotal());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(new Date());

        // Simulate payment processing
        if (paymentRequest.getPaymentMethod() == PaymentMethod.MPESA) {
            payment.setTransactionId("MPESA-" + System.currentTimeMillis());
            payment.setReceiptNumber("RCPT-" + System.currentTimeMillis());
            payment.setStatus(PaymentStatus.SUCCESS);

            // Update order status
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        Payment savedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(savedPayment);
    }

    public PaymentResponse getPaymentStatus(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", transactionId));
        return mapToPaymentResponse(payment);
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .receiptNumber(payment.getReceiptNumber())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}