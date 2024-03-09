package com.dzalex.skillshuffle.services;

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

    private static final String USERNAME_HEADER = "username";
    private static final String PASSWORD_HEADER = "password";

    @Autowired
    private WebSocketAuthenticatorService webSocketAuthenticatorService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) throws AuthenticationException {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT == Objects.requireNonNull(accessor).getCommand()) {
            String username = accessor.getFirstNativeHeader(USERNAME_HEADER);
            String password = accessor.getFirstNativeHeader(PASSWORD_HEADER);

            UsernamePasswordAuthenticationToken user = webSocketAuthenticatorService.getAuthenticatedOrFail(username, password);
            accessor.setUser(user);
        }
        return message;
    }
}