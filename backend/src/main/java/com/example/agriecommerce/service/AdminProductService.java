package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.response.ProductResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.Product;
import com.example.agriecommerce.model.ProductStatus;
import com.example.agriecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductService {
    private final ProductRepository productRepository;

    public List<ProductResponse> getPendingProducts() {
        return productRepository.findByStatus(ProductStatus.PENDING)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse approveProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(ProductStatus.APPROVED);
        product.setReviewedAt(LocalDateTime.now());
        product.setRejectionReason(null);

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    public ProductResponse rejectProduct(Long productId, String rejectionReason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(ProductStatus.REJECTED);
        product.setReviewedAt(LocalDateTime.now());
        product.setRejectionReason(rejectionReason);

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findByStatusIn(List.of(ProductStatus.APPROVED, ProductStatus.ACTIVE))
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
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