package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.ProductRequest;
import com.example.agriecommerce.dto.response.ProductResponse;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.Product;
import com.example.agriecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setCategory(productRequest.getCategory());
        product.setUnitType(productRequest.getUnitType());
        product.setStock(productRequest.getStock());
        product.setImageUrl(productRequest.getImageUrl());
        product.setOrganic(productRequest.getIsOrganic());

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToProductResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setCategory(productRequest.getCategory());
        product.setUnitType(productRequest.getUnitType());
        product.setStock(productRequest.getStock());
        product.setImageUrl(productRequest.getImageUrl());
        product.setOrganic(productRequest.getIsOrganic());

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToProductResponse(Product product) {
        // Build the full URL for the image
        String fullImageUrl = null;
        if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
            fullImageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(product.getImageUrl().startsWith("/") ? product.getImageUrl() : "/" + product.getImageUrl())
                    .toUriString();
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .unitType(product.getUnitType())
                .stock(product.getStock())
                .imageUrl(fullImageUrl)
                .isOrganic(product.getOrganic())
                .build();
    }
}
