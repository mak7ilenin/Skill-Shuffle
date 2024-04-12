import React from 'react';
import { Row, Col } from 'react-bootstrap';

import CreateImage from './CreateImage';

import { ReactComponent as NetworkIcon } from '../assets/icons/network.svg';

function ChatHeader({ chat, openChatMenu }) {

    const formatLastSeenTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const currentDate = new Date();
        const difference = currentDate - date;

        // dd/mmm/yyyy if the message was sent more than a year ago
        // dd/mmm if the message was sent less than a year ago but more than a day ago
        // hh:mm if the message was sent less than a day ago and more than an hour ago
        // mm ago if the message was sent less than an hour ago
        // If the message was sent less than a minute ago then return 'few seconds ago'

        if (difference > 31536000000) {
            return `last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else if (difference > 86400000) {
            return `last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
        } else if (difference > 3600000) {
            return `last seen at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (difference > 60000) {
            return `last seen ${Math.floor(difference / 60000)} minutes ago`;
        } else {
            return 'few seconds ago'
        }
    }

    return (
        <Row className='chat-header'>
            <Col className='chat-avatar me-3' role='button'>
                <CreateImage
                    url={chat.avatarUrl}
                    alt={chat.name}
                    width={55}
                    height={55}
                    rounded={true}
                />
            </Col>
            <Col className='d-flex flex-column'>
                <p role='button' className='chat-name'>{chat.name}</p>

                {chat.type === 'community' ? (
                    <span className='text-secondary'>Community</span>
                ) : chat.type === 'group' ? (
                    <span role='button' onClick={openChatMenu} className='text-secondary'>{chat.memberCount} members</span>
                ) : (
                    <p className='user-activity'>
                        <NetworkIcon className='network-icon' />
                        <span className='text-secondary'>{formatLastSeenTimestamp(chat.user.lastSeen)}</span>
                    </p>
                )}
            </Col>
        </Row>
    )
}

export default ChatHeader