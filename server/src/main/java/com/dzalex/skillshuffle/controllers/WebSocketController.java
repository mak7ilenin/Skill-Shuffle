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
import com.dzalex.skillshuffle.services.ChatService;
import com.dzalex.skillshuffle.services.MessageService;
import com.dzalex.skillshuffle.services.SessionService;
import com.dzalex.skillshuffle.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

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

    @Autowired
    private ChatService chatService;

    @Autowired
    private SessionService sessionService;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessage message) {
        Integer chatId = message.getChat().getId();
        User sender = userRepository.findByNickname(message.getSender().getNickname());

        if (!userService.getUsernamesInChat(chatId).contains(sender.getUsername())) {
            throw new IllegalArgumentException("User is not a member of this chat");
        }

        ChatMessage savedMessage = messageService.saveMessage(message, chatId);

        // Get all users in this chat
        List<String> usernames = userService.getUsernamesInChat(chatId);

        // Send the message to all users who subscribed to chat
        for (String username : usernames) {
            messagingTemplate.convertAndSendToUser(username, "/chat/" + chatId, savedMessage);
        }

        usernames.remove(sender.getUsername()); // Remove sender from the list of usernames
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
                userService.getPublicUserDTO(sender),
                notificationMessage,
                message.getContent(),
                NotificationType.CHAT_MESSAGE
        );

        // Send notifications to users who are not currently subscribed to the chat
        for (String username : usernames) {
            messagingTemplate.convertAndSendToUser(username, "/notification", notification);
        }
    }

    @SubscribeMapping("/chat/{chatId}")
    public void handleSubscription(Integer chatId, SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser().getName();
        if (username != null) {
            sessionService.addSession(username, "/chat/" + chatId, headerAccessor.getSessionId());
        }
    }

    // Event listener for heartbeat messages
    @MessageMapping("/heartbeat")
    public void handleHeartbeat(@Payload PublicUserDTO user) {
        // Update the user's last activity timestamp
        User authUser = userRepository.findByNickname(user.getNickname());
        authUser.setLastSeen(new Timestamp(System.currentTimeMillis()));
        userRepository.save(authUser);
    }

    // Event listener for disconnecting from the WebSocket
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Close status 1000 means normal disconnect, 1001 means browser/tab closed
        if (event.getCloseStatus().getCode() == 1000 || event.getCloseStatus().getCode() == 1001) {
            // Check the chats(private/community) user created without any messages and delete them
            String username = Objects.requireNonNull(event.getUser()).getName();
            if (username != null) {
                User user = userRepository.findByUsername(username);
                chatService.deleteEmptyChatsByAuthedUser(user);
            }
        }
    }

}
