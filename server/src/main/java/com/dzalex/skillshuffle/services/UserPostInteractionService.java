package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.entities.Post;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.entities.UserPostInteraction;
import com.dzalex.skillshuffle.enums.InteractionType;
import com.dzalex.skillshuffle.repositories.UserPostInteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserPostInteractionService {

    @Autowired
    private UserPostInteractionRepository userPostInteractionRepository;

    // Create user post interaction
    public void createUserPostInteraction(User user, Post post, InteractionType interactionType) {
        UserPostInteraction userPostInteraction = new UserPostInteraction();
        userPostInteraction.setUser(user);
        userPostInteraction.setPost(post);
        userPostInteraction.setInteractionType(InteractionType.LIKED);
        userPostInteractionRepository.save(userPostInteraction);
    }

    // Delete user post interaction
    public void deleteUserPostInteraction(UserPostInteraction userPostInteraction) {
        userPostInteractionRepository.delete(userPostInteraction);
    }

    // Get reposted posts
    @Transactional
    public List<Post> getRepostedPosts(Integer userId) {
        List<UserPostInteraction> interactions = userPostInteractionRepository.findAllByUserIdAndInteractionType(userId, InteractionType.REPOSTED);
        return interactions.stream()
                .map(UserPostInteraction::getPost)
                .toList();
    }

    // Get user's post interactions
    public List<UserPostInteraction> getUserPostInteractions(Integer userId, Integer postId) {
        return userPostInteractionRepository.findAllByPostIdAndUserId(postId, userId);
    }

    // Is post liked by user
    public boolean isPostLikedByUser(Integer postId, Integer userId) {
        return userPostInteractionRepository.existsByPostIdAndUserIdAndInteractionType(postId, userId, InteractionType.LIKED);
    }

    // Get post with LIKED interaction
    public UserPostInteraction getPostLikedInteraction(Integer userId, Integer postId) {
        return getUserPostInteractions(userId, postId).stream()
                .filter(interaction -> interaction.getInteractionType() == InteractionType.LIKED)
                .findFirst()
                .orElse(null);
    }

    // Get post with REPOSTED interaction
    public UserPostInteraction getPostRepostedInteraction(Integer userId, Integer postId) {
        return getUserPostInteractions(userId, postId).stream()
                .filter(interaction -> interaction.getInteractionType() == InteractionType.REPOSTED)
                .findFirst()
                .orElse(null);
    }
}
