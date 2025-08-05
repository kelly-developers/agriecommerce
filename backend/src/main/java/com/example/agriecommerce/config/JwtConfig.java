package com.example.agriecommerce.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class JwtConfig {
    private String jwtSecret;
    private long jwtExpirationMs;
    private long jwtRefreshExpirationMs;

    public String getSecret() {
        return jwtSecret;
    }

    public long getExpirationMs() {
        return jwtExpirationMs;
    }

    public long getRefreshExpirationMs() {
        return jwtRefreshExpirationMs;
    }
}
