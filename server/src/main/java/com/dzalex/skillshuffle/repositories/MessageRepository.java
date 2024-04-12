package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository  extends JpaRepository<ChatMessage, Integer> {
    ChatMessage findMessageById(Integer id);
    List<ChatMessage> findMessagesByChatId(Integer chatId);
}
