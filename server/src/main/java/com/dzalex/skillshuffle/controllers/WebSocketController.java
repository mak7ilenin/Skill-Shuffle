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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
public class WebSocketController {
    private final Map<String, List<Message>> chats = new HashMap<>();

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat/{chatId}")
    @SendTo("/user/chat/{chatId}")
    public List<Message> sendMessageWithWebSocket(@DestinationVariable String chatId, @Payload Message message) {
        List<Message> messages = this.chats.getOrDefault(chatId, new ArrayList<>());
        Message savedMessage = messageService.saveMessage(message, chatId);
        messages.add(savedMessage);
        chats.put(chatId, messages);
        return messages;
    }
}
