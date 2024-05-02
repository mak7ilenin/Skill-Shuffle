package com.dzalex.skillshuffle.services;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class AuthChannelInterceptorAdapter implements ChannelInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";

    private static final String AUTHORIZATION_HEADER_PREFIX = "Bearer ";

    @Autowired
    private WebSocketAuthenticatorService webSocketAuthenticatorService;

    @Autowired
    private SessionService sessionService;

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) throws AuthenticationException {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Handle user connection
        if (StompCommand.CONNECT == Objects.requireNonNull(accessor).getCommand()) {
            // Get token from the header and remove the prefix
            String token = accessor.getFirstNativeHeader(AUTHORIZATION_HEADER);
            if (token != null && token.startsWith(AUTHORIZATION_HEADER_PREFIX)) {
                token = token.substring(AUTHORIZATION_HEADER_PREFIX.length());
            }

            UsernamePasswordAuthenticationToken user = webSocketAuthenticatorService.getAuthenticatedOrFail(token);
            accessor.setUser(user);
        }

        // Handle user subscription
        if (StompCommand.SUBSCRIBE == Objects.requireNonNull(accessor.getCommand())) {
            String username = Objects.requireNonNull(accessor.getUser()).getName();
            String destination = accessor.getDestination();
            String subscriptionId = accessor.getSubscriptionId();
            if (username != null && destination != null && subscriptionId != null) {
                sessionService.addSession(username, destination, subscriptionId);

                // Add previous chat ID to the user's session
                if (destination.startsWith("/user/chat/")) {
                    String chatId = destination.split("/")[3];
                    sessionService.addSession(username, "prev-chat", chatId);
                }
            }
        }

        // Handle user unsubscription
        if (StompCommand.UNSUBSCRIBE == Objects.requireNonNull(accessor.getCommand())) {
            String username = Objects.requireNonNull(accessor.getUser()).getName();
            String subscriptionId = accessor.getSubscriptionId();
            if (username != null && subscriptionId != null) {
                sessionService.removeSession(username, subscriptionId);
            }
        }

        return message;
    }
}