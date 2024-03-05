package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public void saveMessage(Message message, String chatId) {
        Message savedMessage = new Message();
        savedMessage.setSender(userRepository.findById(message.getSender().getId()).get());
        savedMessage.setChat(chatRepository.findChatById(Long.parseLong(chatId)));
        savedMessage.setContent(message.getContent());
        savedMessage.setTimestamp(message.getTimestamp());
        messageRepository.save(message);
    }
}
