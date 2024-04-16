package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.enums.ChatType;
import com.dzalex.skillshuffle.enums.NotificationType;
import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.entities.ChatMessage;
import com.dzalex.skillshuffle.dtos.ChatNotificationDTO;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import com.dzalex.skillshuffle.services.MessageService;
import com.dzalex.skillshuffle.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Slf4j
@Controller
public class WebSocketController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessage message) {
        Integer chatId = message.getChat().getId();
        ChatMessage savedMessage = messageService.saveMessage(message, chatId);

        // Get all users in this chat
        List<String> usernames = userService.getUsersInChat(chatId);
        User sender = userRepository.findByNickname(message.getSender().getNickname());
        String senderUsername = sender.getUsername();

        // Send the message to all users who subscribed to chat
        for (String username : usernames) {
            messagingTemplate.convertAndSendToUser(username, "/chat/" + chatId, savedMessage);
        }

        usernames.remove(senderUsername); // Remove sender from the list of usernames
        sendNotification(chatId, savedMessage, usernames, sender);
    }

    public void sendNotification(Integer chatId, ChatMessage message, List<String> usernames, User sender) {
        // Create notification message based on chat type
        String notificationMessage = "";
        Chat chat = chatRepository.findChatById(chatId);
        if (chat.getType() == ChatType.PRIVATE) {
            notificationMessage = sender.getFirstName() + " sent you a message";
        } else if (chat.getType() == ChatType.GROUP) {
            notificationMessage = "New message in " + chat.getName();
        }

        // Create notification object
        ChatNotificationDTO notification = new ChatNotificationDTO(
                chat,
                new PublicUserDTO(
                        sender.getFirstName(),
                        sender.getLastName(),
                        sender.getNickname(),
                        sender.getAvatarUrl(),
                        sender.getLastSeen()
                ),
                notificationMessage,
                message.getContent(),
                NotificationType.CHAT_MESSAGE
        );

        // Send notifications to users who are not currently subscribed to the chat
        for (String username : usernames) {
            messagingTemplate.convertAndSendToUser(username, "/notification", notification);
        }
    }

    // Add method to mark message as seen
    @MessageMapping("/chat/seen")
    public void markMessageAsSeen(@Payload ChatMessage message) {
        messageService.markMessageAsSeen(message);
    }

}
