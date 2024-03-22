package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.models.Chat;
import com.dzalex.skillshuffle.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Chat findChatById(Long id);
}
