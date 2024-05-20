import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

import { AESDecrypt } from '../crypto';
import { useAuth } from './AuthContext';
import { formatTimestampForChatContainer } from '../utils/helpers';

import { RiVolumeMuteFill } from "react-icons/ri";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ChatPreview({ chat, chosenChat, navigate }) {
    const { authUser } = useAuth();

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
            <div className="muted-icon">
                {chat.muted && <RiVolumeMuteFill size={14} />}
            </div>
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
                        ) : chat.lastMessage.type === 'message' && (
                            <p className='last-message text-truncate'>
                                {isMessageOwner() ? (<span className='me'>You: </span>) : null}
                                {chat.lastMessage.content}
                            </p>
                        )}
                        {chat.unreadMessages > 0 && chat.lastMessage.type !== 'entry' && (
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