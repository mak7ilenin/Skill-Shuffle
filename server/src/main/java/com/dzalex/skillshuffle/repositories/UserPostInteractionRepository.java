package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.UserPostInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPostInteractionRepository extends JpaRepository<UserPostInteraction, Integer> {

}
