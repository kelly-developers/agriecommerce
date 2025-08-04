package com.example.agriecommerce.controller;

import com.example.agriecommerce.dto.request.PaymentRequest;
import com.example.agriecommerce.dto.response.PaymentResponse;
import com.example.agriecommerce.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentRequest paymentRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        return ResponseEntity.ok(paymentService.processPayment(userId, paymentRequest));
    }

    @GetMapping("/status/{transactionId}")
    public ResponseEntity<PaymentResponse> getPaymentStatus(@PathVariable String transactionId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(transactionId));
    }

    @PostMapping("/mpesa/stk-push")
    public ResponseEntity<PaymentResponse> initiateMpesaPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentRequest paymentRequest) {
        Long userId = ((UserPrincipal) userDetails).getId();
        paymentRequest.setPaymentMethod(PaymentMethod.MPESA);
        return ResponseEntity.ok(paymentService.processPayment(userId, paymentRequest));
    }

    @GetMapping("/mpesa/status/{checkoutRequestId}")
    public ResponseEntity<PaymentResponse> checkMpesaPaymentStatus(@PathVariable String checkoutRequestId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(checkoutRequestId));
    }
}