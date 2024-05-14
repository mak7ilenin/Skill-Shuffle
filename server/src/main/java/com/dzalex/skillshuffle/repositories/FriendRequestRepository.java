package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    // Find sent friend requests by user id
    List<FriendRequest> findBySenderId(Integer userId);

    // Find received friend requests by user id
    List<FriendRequest> findByReceiverId(Integer userId);

    // Find friend request by sender id and receiver id
    FriendRequest findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);
}
