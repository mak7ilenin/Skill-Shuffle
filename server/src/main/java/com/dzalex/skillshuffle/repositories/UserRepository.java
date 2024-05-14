package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByNickname(String nickname);
    User findByUsername(String username);
    User findByEmail(String email);
    @Query("SELECT u FROM User u WHERE lower(u.nickname) LIKE lower(concat('%', :query,'%')) OR lower(u.firstName) LIKE lower(concat('%', :query,'%')) OR lower(u.lastName) LIKE lower(concat('%', :query,'%'))")
    List<User> searchUsers(@Param("query") String query);
}
