package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.UserFollower;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface UserFollowerRepository extends JpaRepository<UserFollower, Integer> {
    UserFollower findByUserIdAndFollowerId(Integer id, Integer id1);
    List<UserFollower> findAllByUserId(Integer id);
    List<UserFollower>  findAllByFollowerId(Integer id);
}
