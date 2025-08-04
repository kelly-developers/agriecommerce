package com.example.agriecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String county;

    private String postalCode;

    private String additionalInfo;

    private boolean isDefault = false;
}