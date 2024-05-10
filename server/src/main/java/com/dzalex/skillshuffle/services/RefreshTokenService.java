package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.entities.RefreshToken;
import com.dzalex.skillshuffle.repositories.RefreshTokenRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

import static com.dzalex.skillshuffle.services.JwtHelper.REFRESH_TOKEN_VALIDITY;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtHelper helper;

    public RefreshToken generateRefreshToken(String username) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(userRepository.findByUsername(username))
                .expiresAt(Timestamp.from(Instant.now().plusSeconds(REFRESH_TOKEN_VALIDITY)))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token, HttpServletResponse response) {
        if (token == null) {
            throw new RuntimeException("Invalid refresh token. Please make a new login..!");
        }
        if (token.getExpiresAt().compareTo(Timestamp.from(Instant.now())) < 0) {
            refreshTokenRepository.delete(token);
            helper.deleteRefreshTokenCookie(response);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
}
