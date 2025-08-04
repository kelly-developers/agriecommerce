package com.example.agriecommerce.service;

import com.example.agriecommerce.dto.request.LoginRequest;
import com.example.agriecommerce.dto.request.RegisterRequest;
import com.example.agriecommerce.dto.response.AuthResponse;
import com.example.agriecommerce.exception.BadRequestException;
import com.example.agriecommerce.model.User;
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

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId()).getToken();

        return new AuthResponse(
                userRepository.findById(userPrincipal.getId()).orElseThrow(),
                accessToken,
                refreshToken
        );
    }

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address already in use");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                registerRequest.getPassword()
        );

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = refreshTokenService.createRefreshToken(savedUser.getId()).getToken();

        return new AuthResponse(savedUser, accessToken, refreshToken);
    }
}