package com.dzalex.skillshuffle.services;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {
    private final ConcurrentHashMap<String, Map<String, WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    public void addSession(String username, String endpoint, String session) {
        Map<String, WebSocketSession> userEndpoints = userSessions.getOrDefault(username, new ConcurrentHashMap<>());
        userEndpoints.put(endpoint, session);
        userSessions.put(username, userEndpoints);
    }

    public void removeSession(String username, String endpoint) {
        Map<String, WebSocketSession> userEndpoints = userSessions.get(username);
        if (userEndpoints != null) {
            userEndpoints.remove(endpoint);
            if (userEndpoints.isEmpty()) {
                userSessions.remove(username);
            } else {
                userSessions.put(username, userEndpoints);
            }
        }
    }

    public boolean isUserSubscribed(String username, String endpoint) {
        Map<String, WebSocketSession> userEndpoints = userSessions.get(username);
        return userEndpoints != null && userEndpoints.containsKey(endpoint);
    }
}
