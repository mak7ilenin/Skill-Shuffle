package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.FriendRequest;
import com.dzalex.skillshuffle.enums.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    FriendRequest findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);
    List<FriendRequest> findAllByReceiverIdAndStatus(Integer id, FriendRequestStatus friendRequestStatus);
    List<FriendRequest> findAllBySenderIdAndStatus(Integer id, FriendRequestStatus friendRequestStatus);
}
