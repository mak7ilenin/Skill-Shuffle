import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

import { AESDecrypt } from '../crypto';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ChatPreview({ chat, chosenChat, navigate }) {

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
    }

    return (
        <>
            {chat.lastMessage.type !== 'entry' ? (
                <Row className={`chat-preview d-flex align-items-center flex-nowrap${chosenChat && String(chosenChat.id) === AESDecrypt(chat.id) ? ' active' : ''}`}
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
                    </Col>
                    <Col className='chat-info w-75 ps-3'>
                        <p className='chat-name d-flex justify-content-between'>
                            <span className='name'>{chat.name}</span>
                            <span className='timestamp'>{formatTimestampForChatContainer(chat.lastMessage.timestamp)}</span>
                        </p>
                        {chat.lastMessage.type === 'announcement' ? (
                            // Remove the HTML tags from the announcement message
                            <p className='last-message text-truncate'>{chat.lastMessage.content.replace(/<[^>]*>/g, '')}</p>
                        ) : (
                            <p className='last-message text-truncate'>{chat.lastMessage.content}</p>
                        )}
                    </Col>
                </Row>
            ) : null}
        </>
    )
}

export default ChatPreview