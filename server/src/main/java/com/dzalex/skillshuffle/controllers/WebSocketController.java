package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.entities.ChatMessage;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.UserRepository;
import com.dzalex.skillshuffle.services.ChatService;
import com.dzalex.skillshuffle.services.MessageService;
import com.dzalex.skillshuffle.services.SessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.sql.Timestamp;
import java.util.Objects;

@Slf4j
@Controller
public class WebSocketController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private SessionService sessionService;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessage message) {
        messageService.sendMessage(message);
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

                // Remove the user's websocket sessions
                sessionService.removeAllUserSessions(username);
            }
        }
    }

}
