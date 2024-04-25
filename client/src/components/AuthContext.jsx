import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

import { API_SERVER, WEBSOCKET_URL } from '../config';
import MessageNotification from './MessageNotification';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [isStompClientInitialized, setIsStompClientInitialized] = useState(false);
    const [messageNotification, setMessageNotification] = useState({ visible: false, notification: {} });
    const [authUser, setAuthUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('auth-user'));
    });

    // Send heartbeat to the server
    const sendHeartbeat = useCallback(() => {
        if (!isStompClientInitialized) return;
        stompClient.publish({
            destination: '/app/heartbeat',
            body: JSON.stringify(authUser)
        });
    }, [isStompClientInitialized, stompClient, authUser]);

    // Send heartbeats to the server every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            sendHeartbeat();
        }, 240000);
        return () => clearInterval(interval);
    }, [sendHeartbeat]);

    // Subscribe to notifications
    const subscribeToNotifications = useCallback(() => {
        if (!isStompClientInitialized) return;

        stompClient.subscribe('/user/notification', receivedNotification => {
            // Process the received noitification
            const notification = JSON.parse(receivedNotification.body);
            setMessageNotification({ visible: true, notification: notification });
        });
    }, [isStompClientInitialized, stompClient, setMessageNotification]);

    // Initialize the WebSocket connection
    const initializeStompClient = useCallback(() => {
        if (stompClient) {
            subscribeToNotifications();
            return;
        }

        axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
            .then(response => {
                // Store the user in the session storage
                setAuthUser(response.data.user);

                // Create a new WebSocket connection
                const client = new Client({
                    brokerURL: WEBSOCKET_URL,
                    connectHeaders: {
                        Authorization: `Bearer ${response.data.accessToken}`,
                    },
                    onConnect: function (frame) {
                        console.log('Connected: ' + frame);
                        setStompClient(client);
                        setIsStompClientInitialized(true);
                    },
                    onDisconnect: function (frame) {
                        console.log('Disconnected: ' + frame);
                        setStompClient(null);
                        setIsStompClientInitialized(false);
                        setAuthUser(null);
                    }
                });

                client.activate();
                setStompClient(client);
            })
            .catch(error => {
                // console.error('Error while initializing STOMP client:', error);
                setAuthUser(null);
            });
    }, [stompClient, subscribeToNotifications]);

    useEffect(() => {
        initializeStompClient();
    }, [initializeStompClient]);

    useEffect(() => {
        // Store authUser in sessionStorage whenever it changes
        if (authUser) {
            sessionStorage.setItem('auth-user', JSON.stringify(authUser));
        } else {
            sessionStorage.removeItem('auth-user');

            // Disconnect stomp client if user is logged out
            if (stompClient) {
                stompClient.deactivate();
            }
        }
    }, [authUser, stompClient]);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, stompClient, isStompClientInitialized }}>
            {messageNotification.visible && (
                <MessageNotification
                    messageNotification={messageNotification}
                    onDismiss={() => setMessageNotification({ visible: false, notification: {} })}
                />
            )}
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };