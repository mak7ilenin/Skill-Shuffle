package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.ChatDTO;
import com.dzalex.skillshuffle.dtos.ChatPreviewDTO;
import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.models.Chat;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRepository chatRepository;

    @GetMapping("chats")
    public List<ChatPreviewDTO> getChats() {
        return chatService.getChatListWithLastMessage();
    }

    @GetMapping("chats/{id}")
    public ChatDTO getChat(@PathVariable("id") Long id) {
        Chat chat = chatRepository.findChatById(id);
        return chatService.getChatWithMessages(chat);
    }

    @GetMapping("chats/{id}/messages")
    public List<MessageDTO> getChatMessages(@PathVariable("id") Long id,
                                            @RequestParam(defaultValue = "30") int limit,
                                            @RequestParam(defaultValue = "0") int offset) {
        return chatService.getChatMessages(id, limit, offset);
    }
}