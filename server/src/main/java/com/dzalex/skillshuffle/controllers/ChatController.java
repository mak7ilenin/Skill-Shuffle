package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.ChatDTO;
import com.dzalex.skillshuffle.dtos.ChatPreviewDTO;
import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.dtos.NewChatDTO;
import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.services.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping("/chats")
    public ResponseEntity<Chat> createChat(@RequestParam("chat") String chatStr,
                                                 @RequestParam(required = false, name = "avatarBlob") MultipartFile avatarBlob) throws IOException {
        // Convert chatStr to NewChatDTO object
        ObjectMapper mapper = new ObjectMapper();
        NewChatDTO chat = mapper.readValue(chatStr, NewChatDTO.class);

        Chat createdChat = chatService.createChat(chat, avatarBlob);
        if (createdChat != null) {
            return ResponseEntity.ok(createdChat);
        } else {
            return ResponseEntity.internalServerError().build();
        }
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