import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import { SERVER_URL } from '../config';
import { AESEncrypt, AESDecrypt } from '../crypto';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function MessageNotification({ messageNotification, onDismiss }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);
    const debounceTimeout = useRef(null);

    const getCurrentChat = useCallback(() => {
        const encryptedChatId = new URLSearchParams(location.search).get('c');
        if (encryptedChatId) {
            try {
                const decryptedChatId = AESDecrypt(encryptedChatId);
                if (decryptedChatId !== '' && !isNaN(decryptedChatId)) {
                    return parseInt(decryptedChatId);
                }
            } catch (error) {
                console.error("Error decrypting chat: ", error);
            }
        }
        return null;
    }, [location.search]);

    const handleNotification = useCallback(() => {
        const chatId = getCurrentChat();
        if (notification && notification.type === 'CHAT_MESSAGE') {
            if (chatId && notification.chat.id !== chatId) {
                // updateChatLastMessage(notification);
                clearTimeout(debounceTimeout.current);
                debounceTimeout.current = setTimeout(() => {
                    setVisible(true);
                    debounceTimeout.current = null;
                }, 1000);
            }
        }
    }, [getCurrentChat, notification]);

    useEffect(() => {
        if (messageNotification && messageNotification.visible) {
            setNotification(messageNotification.notification);
            handleNotification();
            const timeoutId = setTimeout(() => {
                setVisible(false);
                onDismiss();
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [onDismiss, handleNotification, messageNotification]);

    return (
        visible && (
            <Alert
                variant="light"
                show={visible}
                onClose={() => setVisible(false)}
                onClick={() => {
                    setVisible(false);
                    navigate(`/messenger?c=${AESEncrypt(notification.chat.id.toString())}`);
                }}
                dismissible
                className='alert-notification d-flex flex-column align-items-center'
            >
                <Alert.Heading className='w-100 mb-1'>{notification.message}</Alert.Heading>
                <hr />
                <div className="alert-message w-100 mt-2 d-flex flex-column flex-md-row align-items-center">
                    <Image
                        src={notification.chat.avatar_url ? `${SERVER_URL}/${notification.chat.avatar_url}` : imagePlaceholder}
                        width={35}
                        height={35}
                        alt={notification.chat.name}
                        style={{ objectFit: 'cover', marginRight: '10px' }}
                        roundedCircle
                    />
                    <div className='flex-grow-1 d-flex align-items-center flex-wrap flex-shrink-1'>
                        <h5>{notification.sender.first_name}</h5>
                        <span>{notification.content}</span>
                    </div>
                    <div className="flex-grow-1"></div>
                </div>
            </Alert>
        )
    );
}

export default MessageNotification;
