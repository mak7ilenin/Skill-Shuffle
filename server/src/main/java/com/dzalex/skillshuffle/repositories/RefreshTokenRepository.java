package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    RefreshToken findByToken(String token);
    void deleteByToken(String token);
}
