package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    // Find friendships by user id (it can be either user id or friend id)
    List<Friendship> findByUserIdOrFriendId(Integer userId, Integer friendId);
}
