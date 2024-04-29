package com.dzalex.skillshuffle.services;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {
    private final ConcurrentHashMap<String, Map<String, String>> userSessions = new ConcurrentHashMap<>();

    public void addSession(String username, String endpoint, String sessionId) {
        Map<String, String> userEndpoints = userSessions.getOrDefault(username, new ConcurrentHashMap<>());
        userEndpoints.put(endpoint, sessionId);
        userSessions.put(username, userEndpoints);
    }

    public void removeSession(String username, String endpoint) {
        Map<String, String> userEndpoints = userSessions.get(username);
        if (userEndpoints != null) {
            userEndpoints.remove(endpoint);
            if (userEndpoints.isEmpty()) {
                userSessions.remove(username);
            } else {
                userSessions.put(username, userEndpoints);
            }
        }
    }

    public ConcurrentHashMap<String, Map<String, String>> getUserSessions() {
        return userSessions;
    }

    public void removeAllUserSessions(String username) {
        userSessions.remove(username);
    }

    public boolean isUserSubscribed(String username, String endpoint) {
        Map<String, String> userEndpoints = userSessions.get(username);
        return userEndpoints != null && userEndpoints.containsKey(endpoint);
    }
}
