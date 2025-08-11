package com.example.agriecommerce.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FarmerProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    private String imageUrl;

    @NotBlank
    private String category;

    private String subcategory;

    @Min(0)
    private Integer stock;

    private String origin;

    private String nutritionalInfo;

    private boolean organic;

    @NotBlank
    private String unitType;
}