package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByNickname(String nickname);
    User findByUsername(String username);
    User findByEmail(String email);
}
