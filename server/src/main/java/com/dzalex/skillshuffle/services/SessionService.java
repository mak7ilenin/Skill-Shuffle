package com.dzalex.skillshuffle.services;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {
    private final ConcurrentHashMap<String, Map<String, String>> userSessions = new ConcurrentHashMap<>();

    private final Map<String, String> connectedUsers = new ConcurrentHashMap<>();

    public void addSession(String username, String endpoint, String subscriptionId) {
        Map<String, String> userEndpoints = userSessions.getOrDefault(username, new ConcurrentHashMap<>());
        userEndpoints.put(endpoint, subscriptionId);
        userSessions.put(username, userEndpoints);
    }

    public void removeSession(String username, String subscriptionId) {
        Map<String, String> userEndpoints = userSessions.get(username);
        if (userEndpoints != null) {
            userEndpoints.values().remove(subscriptionId);
            if (userEndpoints.isEmpty()) {
                userSessions.remove(username);
            } else {
                userSessions.put(username, userEndpoints);
            }
        }
    }

    public void removeAllUserSessions(String username) {
        userSessions.remove(username);
    }

    public String getSubscriptionEndpoint(String subscriptionId) {
        for (Map.Entry<String, Map<String, String>> userSession : userSessions.entrySet()) {
            for (Map.Entry<String, String> endpointSubscription : userSession.getValue().entrySet()) {
                if (endpointSubscription.getValue().equals(subscriptionId)) {
                    return endpointSubscription.getKey();
                }
            }
        }
        return null;
    }

    public boolean isUserSubscribed(String username, String endpoint) {
        Map<String, String> userEndpoints = userSessions.get(username);
        return userEndpoints != null && userEndpoints.containsKey(endpoint);
    }

    public void addConnectedUser(String username, String sessionId) {
        connectedUsers.put(username, sessionId);
    }

    public void removeConnectedUser(String username) {
        connectedUsers.remove(username);
    }

    public boolean isConnected(String username) {
        return connectedUsers.containsKey(username);
    }
}
