package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.ChatMessage;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository  extends JpaRepository<ChatMessage, Integer> {
    ChatMessage findMessageById(Integer id);
    @EntityGraph(attributePaths = {"sender"})
    List<ChatMessage> findMessagesByChatId(Integer chatId);
    void deleteAllByChatId(Integer id);
}
