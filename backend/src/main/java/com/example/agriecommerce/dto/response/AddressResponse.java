package com.example.agriecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponse {
    private Long id;
    private String street;
    private String city;
    private String county;
    private String postalCode;
    private String additionalInfo;
    private boolean isDefault;
}