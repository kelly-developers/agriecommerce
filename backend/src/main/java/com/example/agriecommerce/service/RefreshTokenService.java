package com.example.agriecommerce.service;

import com.example.agriecommerce.config.JwtConfig;
import com.example.agriecommerce.exception.TokenRefreshException;
import com.example.agriecommerce.exception.ResourceNotFoundException;
import com.example.agriecommerce.model.RefreshToken;
import com.example.agriecommerce.model.User;
import com.example.agriecommerce.repository.RefreshTokenRepository;
import com.example.agriecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtConfig jwtConfig;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        try {
            // First check if token already exists for this user
            Optional<RefreshToken> existingToken = refreshTokenRepository.findByUserId(userId);

            if (existingToken.isPresent()) {
                // Update existing token
                RefreshToken token = existingToken.get();
                token.setToken(UUID.randomUUID().toString());
                token.setExpiryDate(Instant.now().plusMillis(jwtConfig.getJwtRefreshExpirationMs()));
                log.debug("Updated existing refresh token for user ID: {}", userId);
                return refreshTokenRepository.save(token);
            }

            // Create new token if none exists
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setExpiryDate(Instant.now().plusMillis(jwtConfig.getJwtRefreshExpirationMs()));
            refreshToken.setToken(UUID.randomUUID().toString());

            log.debug("Created new refresh token for user ID: {}", userId);
            return refreshTokenRepository.save(refreshToken);

        } catch (DataIntegrityViolationException e) {
            log.error("Duplicate token detected for user ID: {}. Cleaning up and retrying.", userId);
            // If we still hit a constraint violation, clean up and retry
            refreshTokenRepository.deleteByUserId(userId);
            return createRefreshToken(userId); // Recursive retry
        }
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        refreshTokenRepository.deleteByUserId(userId);
        log.debug("Deleted refresh tokens for user ID: {}", userId);
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token)
                .ifPresent(refreshToken -> {
                    refreshTokenRepository.delete(refreshToken);
                    log.debug("Deleted refresh token: {}", token);
                });
    }

    public Optional<RefreshToken> findByUserId(Long userId) {
        return refreshTokenRepository.findByUserId(userId);
    }
}