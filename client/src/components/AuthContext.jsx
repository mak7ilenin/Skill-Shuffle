import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

import { API_SERVER, WEBSOCKET_URL } from '../config';
import MessageNotification from './MessageNotification';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messageNotification, setMessageNotification] = useState({ visible: false, notification: {} });
    const timeoutRef = useRef(null);
    const debounceTimeout = useRef(null);
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('auth-user'));
    });

    // const showNotification = useCallback((notification) => {
    //     setMessageNotification({ visible: true, notification: notification });
    //     clearTimeout(timeoutRef.current);
    //     timeoutRef.current = setTimeout(() => {
    //         setMessageNotification(prevState => ({
    //             ...prevState,
    //             visible: false,
    //         }));
    //     }, 5000);
    // }, []);

    const subscribeToNotifications = useCallback(() => {
        return stompClient.subscribe(`/user/notification`, receivedNotification => {
            const notification = JSON.parse(receivedNotification.body);
            setMessageNotification({ visible: true, notification: notification });

            // if (notification.type === 'CHAT_MESSAGE' && notification.chat.id !== choosenChat.id) {
            //     updateChatLastMessage(notification);
            //     clearTimeout(debounceTimeout.current);
            //     debounceTimeout.current = setTimeout(() => {
            //         showNotification(notification);
            //         debounceTimeout.current = null;
            //     }, 1000);
            // }
        });
    }, [stompClient, setMessageNotification]);

    // Handle the WebSocket connection
    useEffect(() => {
        let notificationSubscription = null;
        if (stompClient != null) {
            const onConnectCallback = () => {
                // Subscribe to notifications
                notificationSubscription = subscribeToNotifications();
            };
            stompClient.onConnect = onConnectCallback;
            if (stompClient.connected) {
                onConnectCallback();
            }
        }

        return () => {
            if (notificationSubscription) {
                notificationSubscription.unsubscribe();
            }
        };
    }, [stompClient, subscribeToNotifications]);


    useEffect(() => {
        // Check user's authentication status with refresh token
        if (!authUser) {
            axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
                .then(response => {
                    if (response.status === 200) {
                        setAuthUser(response.data.user);
                    }
                })
                .catch(() => {
                    setAuthUser(null);
                    navigate('/sign-in');
                });
        } else {
            if (!stompClient) {
                axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
                    .then(response => {
                        // Create a new WebSocket connection
                        const client = new Client({
                            brokerURL: WEBSOCKET_URL,
                            connectHeaders: {
                                Authorization: `Bearer ${response.data.access_token}`,
                            },
                        });
                        client.activate();
                        setStompClient(client);
                    })
                    .catch(() => {
                        setAuthUser(null);
                        navigate('/sign-in');
                    });
            }
        }
    }, [authUser, stompClient, setStompClient, navigate]);

    useEffect(() => {
        // Store authUser in sessionStorage whenever it changes
        if (authUser) {
            sessionStorage.setItem('auth-user', JSON.stringify(authUser));
        } else {
            sessionStorage.removeItem('auth-user');
        }
    }, [authUser]);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, stompClient }}>
            {/* Show MessageNotification if there is a new message */}
            {messageNotification.visible && (
                <MessageNotification
                    notification={messageNotification}
                    onDismiss={() => setMessageNotification({ visible: false, notification: {} })}
                />
            )}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
