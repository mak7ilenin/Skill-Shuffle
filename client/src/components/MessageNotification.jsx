import React, { useState, useEffect } from 'react';
import { Toast, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { AESEncrypt } from '../crypto';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function MessageNotification({ setMessageNotification, messageNotification, chatId }) {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (messageNotification && messageNotification.visible) {
            setNotification(messageNotification.notification);
            if (messageNotification.notification.type === 'CHAT_MESSAGE' && messageNotification.notification.chat.id !== chatId) {
                setVisible(true);
                setMessageNotification({ visible: false, notification: null });
            }
        }
    }, [messageNotification, setMessageNotification, chatId]);

    return (
        visible && (
            <Toast
                className='toast-notification d-flex flex-column align-items-center p-2'
                onClose={(e) => {
                    if (e) e.stopPropagation();
                    setVisible(false)
                }}
                onClick={() => {
                    setVisible(false);
                    navigate(`/messenger?c=${AESEncrypt(notification.chat.id.toString())}`);
                }}
                delay={5000}
                autohide
            >
                <Toast.Header className='w-100'>
                    <Image
                        src={notification.chat.avatarUrl ? notification.chat.avatarUrl : imagePlaceholder}
                        width={35}
                        height={35}
                        alt={notification.chat.name}
                        style={{ objectFit: 'cover', marginRight: '10px' }}
                        roundedCircle
                    />
                    <h5>{notification.message}</h5>
                </Toast.Header>
                <Toast.Body className='w-100 pe-2 text-lg-start'>
                    {notification.content}
                </Toast.Body>
            </Toast>
        )
    );
}

export default MessageNotification;
