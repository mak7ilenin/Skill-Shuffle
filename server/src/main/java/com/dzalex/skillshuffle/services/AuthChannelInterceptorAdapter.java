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

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String AUTHORIZATION_HEADER_PREFIX = "Bearer ";

    @Autowired
    private WebSocketAuthenticatorService webSocketAuthenticatorService;


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) throws AuthenticationException {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT == Objects.requireNonNull(accessor).getCommand()) {
            // Get token from the header and remove the prefix
            String token = accessor.getFirstNativeHeader(AUTHORIZATION_HEADER);
            if (token != null && token.startsWith(AUTHORIZATION_HEADER_PREFIX)) {
                token = token.substring(AUTHORIZATION_HEADER_PREFIX.length());
            }

            UsernamePasswordAuthenticationToken user = webSocketAuthenticatorService.getAuthenticatedOrFail(token);
            accessor.setUser(user);
        }
        return message;
    }
}