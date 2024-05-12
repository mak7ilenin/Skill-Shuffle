import React, { useState, useEffect, useRef } from 'react';
import { Toast, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { AESEncrypt } from '../crypto';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import sound from '../assets/sounds/erm-what-the-sigma.mp3';

function MessageNotification({ setMessageNotification, messageNotification, chatId }) {
    const navigate = useNavigate();
    const soundRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (messageNotification && messageNotification.visible) {
            const msgNotification = messageNotification.notification;
            setNotification(msgNotification);
            if (msgNotification.type === 'CHAT_MESSAGE' && msgNotification.chat.id !== chatId) {
                setVisible(true);

                // Play notification sound
                if (!soundRef.current || soundRef.current.paused) {
                    const notificationSound = new Audio(sound);
                    notificationSound.play()
                        .then(() => {
                            soundRef.current = notificationSound;
                        })
                        .catch(/* User didn't interacted with document yet */);
                }
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
                    setMessageNotification({ visible: false, notification: null });
                }}
                onClick={() => {
                    setVisible(false);
                    navigate(`/messenger?c=${AESEncrypt(notification.chat.id.toString())}`);
                    setMessageNotification({ visible: false, notification: null });
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
