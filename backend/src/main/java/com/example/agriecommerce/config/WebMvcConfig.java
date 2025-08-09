package com.example.agriecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${upload.directory}")
    private String uploadDirectory;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // For development
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDirectory + "/")
                .setCachePeriod(3600);

        // Additional configuration for Render
        registry.addResourceHandler("/static/uploads/**")
                .addResourceLocations("file:/var/data/uploads/")
                .setCachePeriod(3600);
    }
}