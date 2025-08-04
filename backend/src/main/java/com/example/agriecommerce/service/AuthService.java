package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.LoginRequest;
import com.example.agriecommerce.dto.request.RefreshTokenRequest;
import com.example.agriecommerce.dto.request.RegisterRequest;
import com.example.agriecommerce.dto.response.AuthResponse;
import com.example.agriecommerce.exception.BadRequestException;
import com.example.agriecommerce.exception.TokenRefreshException;
import com.example.agriecommerce.model.RefreshToken;
import com.example.agriecommerce.model.User;
import com.example.agriecommerce.model.UserRole;
import com.example.agriecommerce.repository.UserRepository;
import com.example.agriecommerce.security.JwtTokenProvider;
import com.example.agriecommerce.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            String accessToken = tokenProvider.generateToken(userPrincipal);
            String refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId()).getToken();

            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return AuthResponse.of(user, accessToken, refreshToken);
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address already in use");
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .role(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);

        UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
        String accessToken = tokenProvider.generateToken(userPrincipal);
        String refreshToken = refreshTokenService.createRefreshToken(savedUser.getId()).getToken();

        return AuthResponse.of(savedUser, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenRequest.getRefreshToken())
                .orElseThrow(() -> new TokenRefreshException(
                        refreshTokenRequest.getRefreshToken(),
                        "Refresh token not found"
                ));

        refreshTokenService.verifyExpiration(refreshToken);

        // Get user details from the refresh token
        User user = refreshToken.getUser();
        UserPrincipal userPrincipal = UserPrincipal.create(user);

        // Generate new access token
        String accessToken = tokenProvider.generateToken(userPrincipal);

        return AuthResponse.of(user, accessToken, refreshToken.getToken());
    }
}