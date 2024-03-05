package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.services.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.*;

@Slf4j
@Controller
public class ChatController {
    private final Map<String, List<Message>> chats = new HashMap<>();

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat/{chatId}")
    @SendTo("/topic/chat/{chatId}")
    public List<Message> sendMessageWithWebSocket(@DestinationVariable String chatId, @Payload Message message) {
        List<Message> messages = this.chats.getOrDefault(chatId, new ArrayList<>());
        messages.add(message);
        chats.put(chatId, messages);
        messageService.saveMessage(message, chatId);
        return messages;
    }
}