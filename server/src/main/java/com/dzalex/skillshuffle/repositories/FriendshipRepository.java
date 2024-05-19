package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    List<Friendship> findByUserIdOrFriendId(Integer userId, Integer friendId);
    Friendship findByUserIdAndFriendId(Integer userId, Integer friendId);
}
