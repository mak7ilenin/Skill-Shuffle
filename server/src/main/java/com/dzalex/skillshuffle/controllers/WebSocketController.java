package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.enums.ChatType;
import com.dzalex.skillshuffle.enums.NotificationType;
import com.dzalex.skillshuffle.models.Chat;
import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.models.ChatNotification;
import com.dzalex.skillshuffle.models.User;
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
    public void sendMessage(@Payload Message message) {
        String chatId = message.getChat().getId().toString();
        Message savedMessage = messageService.saveMessage(message, chatId);

        // Get all users in this chat
        List<String> usernames = userService.getUsersInChat(Long.parseLong(chatId));
        User sender = userRepository.findByNickname(message.getSender().getNickname());
        String senderUsername = sender.getUsername();

        // Send the message to all users who subscribed to chat
        for (String username : usernames) {
            messagingTemplate.convertAndSendToUser(username, "/chat/" + chatId, savedMessage);
        }

        usernames.remove(senderUsername); // Remove sender from the list of usernames
        sendNotification(chatId, savedMessage, usernames, sender);
    }

    public void sendNotification(String chatId, Message message, List<String> usernames, User sender) {
        // Create notification message based on chat type
        String notificationMessage = "";
        Chat chat = chatRepository.findChatById(Long.parseLong(chatId));
        if (chat.getType() == ChatType.PRIVATE) {
            notificationMessage = sender.getFirst_name() + " sent you a message";
        } else if (chat.getType() == ChatType.GROUP) {
            notificationMessage = "New message in " + chat.getName();
        }

        // Create notification object
        ChatNotification notification = new ChatNotification(
                chat,
                new PublicUserDTO(
                        sender.getFirst_name(),
                        sender.getLast_name(),
                        sender.getNickname(),
                        sender.getAvatar_url()
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

}
