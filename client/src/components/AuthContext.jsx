import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

import { API_SERVER, WEBSOCKET_URL } from '../config';
import MessageNotification from './MessageNotification';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [stompClient, setStompClient] = useState(null);
    const [isStompClientInitialized, setIsStompClientInitialized] = useState(false);
    const [messageNotification, setMessageNotification] = useState({ visible: false, notification: {} });
    const [authUser, setAuthUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('auth-user'));
    });

    const subscribeToNotifications = useCallback(() => {
        if (!isStompClientInitialized) {
            console.log('STOMP client is not yet initialized.');
            return;
        }
        stompClient.subscribe('/user/notification', receivedNotification => {
            // Process the received message
            const notification = JSON.parse(receivedNotification.body);
            setMessageNotification({ visible: true, notification: notification });
        });
    }, [isStompClientInitialized, stompClient, setMessageNotification]);

    const initializeStompClient = useCallback(() => {
        // if (stompClient) {
        //     console.log('STOMP client is already initialized.');
        //     subscribeToNotifications();
        //     return;
        // }

        // if (!authUser) {
        //     axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
        //         .then(response => {
        //             if (response.status === 200) {
        //                 setAuthUser(response.data.user);
        //             }
        //         })
        //         .catch(() => {
        //             setAuthUser(null);
        //             navigate('/sign-in');
        //         });
        // } else {
        //     if (!stompClient) {
        //         console.log('Initializing STOMP client...');
        //         axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
        //             .then(response => {
        //                 // Create a new WebSocket connection
        //                 const client = new Client({
        //                     brokerURL: WEBSOCKET_URL,
        //                     connectHeaders: {
        //                         Authorization: `Bearer ${response.data.access_token}`,
        //                     },
        //                     onConnect: function (frame) {
        //                         console.log('Connected: ' + frame);
        //                         setStompClient(client);
        //                         setIsStompClientInitialized(true);
        //                     }
        //                 });
        //                 client.activate();
        //                 setStompClient(client);
        //             })
        //             .catch(error => {
        //                 console.error('Error while initializing STOMP client:', error);
        //                 setAuthUser(null);
        //                 navigate('/sign-in');
        //             });
        //     }
        // }
    }, 
    [navigate, stompClient, authUser, subscribeToNotifications]);

    useEffect(() => {
        initializeStompClient();
    }, [initializeStompClient]);

    useEffect(() => {
        // Store authUser in sessionStorage whenever it changes
        if (authUser) {
            sessionStorage.setItem('auth-user', JSON.stringify(authUser));
        } else {
            sessionStorage.removeItem('auth-user');
        }
    }, [authUser]);

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