package com.example.agriecommerce.dto.response;

import com.example.agriecommerce.model.User;
import lombok.Data;

@Data
public class AuthResponse {
    private UserResponse user;
    private String token;
    private String refreshToken;

    public AuthResponse(User user, String token, String refreshToken) {
        this.user = new UserResponse(user);
        this.token = token;
        this.refreshToken = refreshToken;
    }
}