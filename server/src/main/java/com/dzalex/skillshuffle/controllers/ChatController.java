package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.ChatDTO;
import com.dzalex.skillshuffle.dtos.ChatPreviewDTO;
import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRepository chatRepository;

    @GetMapping("/chats")
    public List<ChatPreviewDTO> getChats() {
        return chatService.getChatList();
    }

    @GetMapping("/chats/{id}")
    public ChatDTO getChat(@PathVariable("id") Integer id) {
        Chat chat = chatRepository.findChatById(id);
        return chatService.getChatWithMessages(chat);
    }

    @GetMapping("/chats/{id}/messages")
    public List<MessageDTO> getChatMessages(@PathVariable("id") Integer id,
                                            @RequestParam(defaultValue = "30") int limit,
                                            @RequestParam(defaultValue = "0") int offset) {
        return chatService.getChatMessages(id, limit, offset);
    }
}