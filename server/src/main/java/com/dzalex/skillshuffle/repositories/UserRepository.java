package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByUsernameAndPassword(String username, String password);
    User findByUsernameOrEmailAndPassword(String username, String email, String password);

}
