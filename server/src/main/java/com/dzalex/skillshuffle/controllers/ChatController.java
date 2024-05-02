package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.*;
import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.entities.ChatMember;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.services.ChatService;
import com.dzalex.skillshuffle.services.MessageService;
import com.dzalex.skillshuffle.services.SessionService;
import com.dzalex.skillshuffle.services.UserService;
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

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    // Get chat list
    @GetMapping("/chats")
    public List<ChatPreviewDTO> getChats() {
        return chatService.getChatList();
    }

    // Create chat
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

    // Get chat info with messages and members
    @GetMapping("/chats/{id}")
    public ChatDTO getChat(@PathVariable("id") Integer id) {
        Chat chat = chatRepository.findChatById(id);
        return chatService.getChatWithMessages(chat);
    }

    // Update chat avatar
    @PatchMapping("/chats/{id}/avatar")
    public ResponseEntity<Chat> updateChatAvatar(@PathVariable("id") Integer id,
                                                 @RequestParam("avatarBlob") MultipartFile avatarBlob) {
        Chat chat = chatRepository.findChatById(id);
        Chat updatedChat = chatService.updateChatAvatar(chat, avatarBlob);
        if (updatedChat != null) {
            return ResponseEntity.ok(updatedChat);
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get chat messages
    @GetMapping("/chats/{id}/messages")
    public List<MessageDTO> getChatMessages(@PathVariable("id") Integer id,
                                            @RequestParam(defaultValue = "30") int limit,
                                            @RequestParam(defaultValue = "0") int offset) {
        ChatMember member = chatMemberRepository.findChatMemberByChatIdAndMemberId(id, userService.getCurrentUser().getId());
        return messageService.getChatMessages(id, member, limit, offset);
    }

    // Invite members to chat
    @PostMapping("/chats/{id}/members")
    public ChatDTO addChatMembers(@PathVariable("id") Integer id,
                                  @RequestBody List<String> users) {
        Chat chat = chatRepository.findChatById(id);
        return chatService.inviteMembersToChat(chat, users);
    }

    // Get friend list for a chat 'add members' modal
    @GetMapping("/chats/{id}/friends")
    public List<PublicUserDTO> getFriendListForChat(@PathVariable("id") Integer id) {
        Chat chat = chatRepository.findChatById(id);
        return chatService.getFriendListForChat(chat);
    }

    // Remove chat member
    @DeleteMapping("/chats/{id}/remove?nn={nickname}")
    public ResponseEntity<Chat> removeChatMember(@PathVariable("id") Integer id,
                                                 @PathVariable("nickname") String nickname) {
        Chat chat = chatRepository.findChatById(id);
        chatService.removeMemberFromChat(chat, userService.getUserByNickname(nickname));
        return ResponseEntity.ok(chat);
    }

    // Leave chat
    @DeleteMapping("/chats/{id}/leave")
    public void leaveChat(@PathVariable("id") Integer id) {
        Chat chat = chatRepository.findChatById(id);
        chatService.leaveChat(chat);
    }

    // Return to chat
    @PatchMapping("/chats/{id}/return")
    public ChatDTO returnToChat(@PathVariable("id") Integer id) {
        Chat chat = chatRepository.findChatById(id);
        return chatService.returnToChat(chat);
    }

    // Update chat notifications
    @PatchMapping("/chats/{id}/notifications")
    public void updateChatNotifications(@PathVariable("id") Integer id,
                                        @RequestParam("s") boolean state) {
        Chat chat = chatRepository.findChatById(id);
        chatService.updateChatNotifications(chat, state);
    }

    // Clear chat history
    @PatchMapping("/chats/{id}/clear")
    public void clearChatHistory(@PathVariable("id") Integer id) {
        Chat chat = chatRepository.findChatById(id);
        chatService.clearChatHistory(chat);
    }
}