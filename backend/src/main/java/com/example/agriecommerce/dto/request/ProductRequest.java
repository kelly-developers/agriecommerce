package com.example.agriecommerce.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotBlank
    private String category;

    @NotBlank
    private String unitType;

    @Min(0)
    private Integer stock;

    private String imageUrl;

    private Boolean isOrganic = false;
}