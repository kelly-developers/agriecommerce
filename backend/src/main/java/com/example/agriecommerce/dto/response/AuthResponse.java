package com.example.agriecommerce.dto.response;

import com.example.agriecommerce.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private UserResponse user;
    private String token;
    private String refreshToken;

    public static AuthResponse of(User user, String token, String refreshToken) {
        return new AuthResponse(
                UserResponse.from(user),
                token,
                refreshToken
        );
    }
}