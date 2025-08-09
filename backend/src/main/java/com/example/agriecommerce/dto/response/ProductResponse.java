package com.example.agriecommerce.dto.response;

import java.math.BigDecimal;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String unitType;
    private Integer stock;
    private String imageUrl;
    private Boolean isOrganic;

    // Builder pattern
    public static ProductResponseBuilder builder() {
        return new ProductResponseBuilder();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsOrganic() {
        return isOrganic;
    }

    public void setIsOrganic(Boolean organic) {
        isOrganic = organic;
    }

    // Builder class
    public static class ProductResponseBuilder {
        private final ProductResponse productResponse;

        public ProductResponseBuilder() {
            productResponse = new ProductResponse();
        }

        public ProductResponseBuilder id(Long id) {
            productResponse.id = id;
            return this;
        }

        public ProductResponseBuilder name(String name) {
            productResponse.name = name;
            return this;
        }

        public ProductResponseBuilder description(String description) {
            productResponse.description = description;
            return this;
        }

        public ProductResponseBuilder price(BigDecimal price) {
            productResponse.price = price;
            return this;
        }

        public ProductResponseBuilder category(String category) {
            productResponse.category = category;
            return this;
        }

        public ProductResponseBuilder unitType(String unitType) {
            productResponse.unitType = unitType;
            return this;
        }

        public ProductResponseBuilder stock(Integer stock) {
            productResponse.stock = stock;
            return this;
        }

        public ProductResponseBuilder imageUrl(String imageUrl) {
            productResponse.imageUrl = imageUrl;
            return this;
        }

        public ProductResponseBuilder isOrganic(Boolean isOrganic) {
            productResponse.isOrganic = isOrganic;
            return this;
        }

        public ProductResponse build() {
            return productResponse;
        }
    }
}