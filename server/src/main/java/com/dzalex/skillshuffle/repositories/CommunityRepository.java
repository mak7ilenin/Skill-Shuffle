package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.Community;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<Community, Integer> {
    Community findCommunityById(Integer id);
}
