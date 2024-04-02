import React, { useState, useEffect } from 'react';
import { Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { SERVER_URL } from '../config';
import { AESEncrypt } from '../crypto';
import { useAuth } from './AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function MessageNotification({ messageNotification, onDismiss }) {
    // const { notification } = useAuth();
    // const [show, setShow] = useState(notification.visible);

    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        console.log("MessageNotification useEffect - messageNotification:", messageNotification);
        if (messageNotification && messageNotification.visible) {
            setVisible(true);
            setNotification(messageNotification.notification);
            const timeoutId = setTimeout(() => {
                setVisible(false);
                onDismiss();
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [onDismiss, messageNotification]);

    // if (notification.type === 'CHAT_MESSAGE' && notification.chat.id !== choosenChat.id) {
    //     updateChatLastMessage(notification);
    //     clearTimeout(debounceTimeout.current);
    //     debounceTimeout.current = setTimeout(() => {
    //         showNotification(notification);
    //         debounceTimeout.current = null;
    //     }, 1000);
    // }

    return (
        // Show the notification if the notification is visible
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
