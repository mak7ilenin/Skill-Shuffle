package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.UserPostInteraction;
import com.dzalex.skillshuffle.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPostInteractionRepository extends JpaRepository<UserPostInteraction, Integer> {
    List<UserPostInteraction> findAllByPostIdAndUserId(Integer postId, Integer userId);
    boolean existsByPostIdAndUserIdAndInteractionType(Integer postId, Integer userId, InteractionType type);
    List<UserPostInteraction> findAllByUserIdAndInteractionType(Integer userId, InteractionType interactionType);
    int countAllByUserIdAndInteractionType(Integer userId, InteractionType interactionType);
    void deleteAllByPostId(Integer postId);
}
