package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.enums.NotificationType;
import com.dzalex.skillshuffle.models.Chat;
import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.models.ChatNotification;
import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import com.dzalex.skillshuffle.services.MessageService;
import com.dzalex.skillshuffle.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private UserService userService;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatId}")
    @SendTo("/user/chat/{chatId}")
    public List<Message> sendMessageWithWebSocket(@DestinationVariable String chatId, @Payload Message message) {
        List<Message> messages = this.chats.getOrDefault(chatId, new ArrayList<>());
        Message savedMessage = messageService.saveMessage(message, chatId);
        messages.add(savedMessage);
        chats.put(chatId, messages);

        // Get all users in this chat that connected to the websocket and send them the notification
        List<String> users = userService.getUsersInChat(Long.parseLong(chatId));
        users.remove(message.getSender().getNickname());
        ChatNotification notification = new ChatNotification(
                chatRepository.findChatById(Long.parseLong(chatId)),
                new PublicUserDTO(
                        message.getSender().getFirst_name(),
                        message.getSender().getLast_name(),
                        message.getSender().getNickname(),
                        message.getSender().getAvatar_url()
                ),
                "New message from " + message.getSender().getFirst_name() + " " + message.getSender().getLast_name(),
                NotificationType.CHAT_MESSAGE
        );
        for (String nickname : users) {
            messagingTemplate.convertAndSend("/user/" + nickname + "/notifications", notification);
        }
        return messages;
    }
}
