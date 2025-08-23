package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.FarmerProductRequest;
import com.example.agriecommerce.dto.response.ProductResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.Product;
import com.example.agriecommerce.model.ProductStatus;
import com.example.agriecommerce.model.User;
import com.example.agriecommerce.repository.ProductRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmerService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductResponse submitProduct(Long userId, FarmerProductRequest request) {
        User farmer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setSubcategory(request.getSubcategory());
        product.setStock(request.getStock());
        product.setOrigin(request.getOrigin());
        product.setNutritionalInfo(request.getNutritionalInfo());
        product.setOrganic(request.isOrganic());
        product.setUnitType(request.getUnitType());
        product.setFarmer(farmer);
        product.setStatus(ProductStatus.PENDING); // Set status to pending

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    public List<ProductResponse> getMyProducts(Long userId) {
        return productRepository.findByFarmerId(userId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse updateProduct(Long userId, Long productId, FarmerProductRequest request) {
        Product product = productRepository.findByIdAndFarmerId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Only allow updates if product is pending
        if (product.getStatus() != ProductStatus.PENDING) {
            throw new IllegalStateException("Only pending products can be updated");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setSubcategory(request.getSubcategory());
        product.setStock(request.getStock());
        product.setOrigin(request.getOrigin());
        product.setNutritionalInfo(request.getNutritionalInfo());
        product.setOrganic(request.isOrganic());
        product.setUnitType(request.getUnitType());

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    public void deleteProduct(Long userId, Long productId) {
        Product product = productRepository.findByIdAndFarmerId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Only allow deletion if product is pending
        if (product.getStatus() != ProductStatus.PENDING) {
            throw new IllegalStateException("Only pending products can be deleted");
        }

        productRepository.delete(product);
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .subcategory(product.getSubcategory())
                .stock(product.getStock())
                .origin(product.getOrigin())
                .nutritionalInfo(product.getNutritionalInfo())
                .isOrganic(product.getOrganic())
                .unitType(product.getUnitType())
                .status(product.getStatus().name())
                .rejectionReason(product.getRejectionReason())
                .submittedAt(product.getSubmittedAt())
                .reviewedAt(product.getReviewedAt())
                .farmerId(product.getFarmer().getId())
                .farmerName(product.getFarmer().getFirstName() + " " + product.getFarmer().getLastName())
                .build();
    }
}