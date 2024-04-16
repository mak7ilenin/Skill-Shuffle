package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.ChatMessage;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository  extends JpaRepository<ChatMessage, Integer> {
    ChatMessage findMessageById(Integer id);
    @EntityGraph(attributePaths = {"sender"})
    List<ChatMessage> findMessagesByChatId(Integer chatId);
//    @Query("SELECT m FROM ChatMessage m JOIN FETCH m.sender WHERE m.chat.id = :chatId")
//    List<ChatMessage> findMessagesByChatId(@Param("chatId") Integer chatId);
    void deleteAllByChatId(Integer id);
}
