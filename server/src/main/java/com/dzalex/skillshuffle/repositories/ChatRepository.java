package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Chat findChatById(Long id);
}
