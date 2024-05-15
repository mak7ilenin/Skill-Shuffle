import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

import { AESDecrypt } from '../crypto';
import { useAuth } from './AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ChatPreview({ chat, chosenChat, navigate }) {
    const { authUser } = useAuth();

    const formatTimestampForChatContainer = (timestamp) => {
        const date = new Date(timestamp);
        const currentDate = new Date();
        const difference = currentDate - date;

        if (difference > 31536000000) {
            // dd/mmm/yyyy if the message was sent more than a year ago
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        } else if (difference > 86400000) {
            // dd/mmm if the message was sent less than a year ago but more than a day ago
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        } else {
            // hh:mm if the message was sent less than a day ago
            return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
        }
    };

    const isMessageOwner = () => {
        return chat.lastMessage.sender.nickname === authUser.nickname;
    };

    const isActive = chosenChat && String(chosenChat.id) === AESDecrypt(chat.id);

    return (
        <Row className={`chat-preview d-flex align-items-center flex-nowrap ${isActive ? ' active' : ''}`}
            key={chat.id}
            role='button'
            onClick={() => navigate(`/messenger?c=${chat.id}`)}
        >
            <Col className='chat-avatar d-flex justify-content-center'>
                <Image
                    src={chat.avatarUrl !== null ? chat.avatarUrl : imagePlaceholder}
                    alt={chat.name}
                    width='55'
                    height='55'
                    style={{ objectFit: 'cover' }}
                    roundedCircle
                />
                {chat.type === 'private' && chat.online && (
                    <div className="online-icon rounded-circle"></div>
                )}
            </Col>
            <Col className='chat-info w-75 ps-3'>
                <p className='chat-name d-flex justify-content-between'>
                    <span className='name'>{chat.name}</span>
                    {chat.lastMessage !== null && (
                        <span className='timestamp'>{formatTimestampForChatContainer(chat.lastMessage.timestamp)}</span>
                    )}
                </p>
                {chat.lastMessage !== null && (
                    <Row className='d-flex justify-content-between'>
                        {chat.lastMessage.type === 'announcement' ? (
                            // Remove the HTML tags from the announcement message
                            <p className='last-message text-truncate'>{chat.lastMessage.content.replace(/<[^>]*>/g, '')}</p>
                        ) : (
                            <p className='last-message text-truncate'>
                                {isMessageOwner() ? (<span className='me'>You: </span>) : null}
                                {chat.lastMessage.content}
                            </p>
                        )}
                        {chat.unreadMessages > 0 && (
                            <div className={`unread-messages p-0 rounded-circle d-flex justify-content-center align-items-center ${chat.muted ? 'muted' : ''}`}>
                                {chat.unreadMessages}
                            </div>
                        )}
                    </Row>
                )}
            </Col>
        </Row>
    )
}

export default ChatPreview