package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository  extends JpaRepository<Message, Long> {
    Message findMessageById(Long id);
    List<Message> findMessagesByChatId(Long chatId);
}
