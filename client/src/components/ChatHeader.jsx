import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import ChatSmallMenu from './ChatSmallMenu';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as NetworkIcon } from '../assets/icons/network.svg';
import { IoArrowBack } from "react-icons/io5";

function ChatHeader({ chat, setChat, setChats, handleMenuChange }) {
    const navigate = useNavigate();

    const generateLink = () => {
        switch (chat.type) {
            case 'private':
                return `/users?nn=${chat.members[0].nickname}`;
            case 'community':
                return `/communities?nn=${chat.community.nickname}`;
            default:
                return '/';
        }
    };

    const handleOpenGroupMenu = () => {
        // If user is left, then hide group chat information
        if (chat.members !== null) {
            handleMenuChange('GROUP_MENU')
        };
    };

    const formatLastSeenTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const currentDate = new Date();
        const difference = currentDate - date;

        if (difference > 31536000000) {
            // dd/mmm/yyyy if the message was sent more than a year ago
            return `last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else if (difference > 86400000) {
            // dd/mmm if the message was sent less than a year ago but more than a day ago
            return `last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
        } else if (difference > 3600000) {
            // hh:mm if the message was sent less than a day ago and more than an hour ago
            return `last seen at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (difference > 300000) {
            // mm ago if message was sent more than 5 minutes
            return `last seen ${Math.floor(difference / 60000)} minutes ago`;
        } else {
            // If the message was sent less than 5 minutes ago then return 'Online'
            return 'Online';
        }
    };

    return (
        <Row className='chat-header d-flex align-items-center justify-content-between'>
            <Col className='back-btn-col me-3'>
                <Button
                    variant='link'
                    className='back-btn p-0 d-flex justify-content-center align-items-center rounded-circle'
                    onClick={() => {
                        handleMenuChange('DEFAULT');
                        navigate('/messenger');
                        setChat(null);
                    }}
                >
                    <IoArrowBack />
                </Button>
            </Col>
            {chat.type !== 'group' ? (
                <div className='chat-info'>
                    <Col className='chat-avatar me-3' role='button'>
                        <Image
                            src={chat.avatarUrl !== null ? chat.avatarUrl : imagePlaceholder}
                            alt={chat.name}
                            width='55'
                            height='55'
                            style={{ objectFit: 'cover' }}
                            onClick={() => navigate(generateLink())}
                            roundedCircle
                        />
                    </Col>
                    <Col className='d-flex flex-column'>
                        <p role='button' className='chat-name' onClick={() => navigate(generateLink())}>
                            {chat.name}
                        </p>

                        {chat.type === 'community' ? (
                            <span>Community</span>
                        ) : (
                            <div className='user-activity'>
                                {formatLastSeenTimestamp(chat.members[0].lastSeen) === 'Online' ? (
                                    <>
                                        <div className="online-icon rounded-circle"></div>
                                        <span>Online</span>
                                    </>
                                ) : (
                                    <>
                                        <NetworkIcon className='network-icon' />
                                        <span>{formatLastSeenTimestamp(chat.members[0].lastSeen)}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </Col>
                </div>
            ) : (
                <div className='chat-info'>
                    <Col className='chat-avatar me-3' role='button' onClick={handleOpenGroupMenu}>
                        <Image
                            src={chat.avatarUrl !== null ? chat.avatarUrl : imagePlaceholder}
                            alt={chat.name}
                            width='55'
                            height='55'
                            style={{ objectFit: 'cover' }}
                            roundedCircle
                        />
                    </Col>
                    <Col className='d-flex flex-column'>
                        <p role='button' className='chat-name' onClick={handleOpenGroupMenu}>{chat.name}</p>
                        {chat.members !== null && (
                            <span role='button' onClick={handleOpenGroupMenu}>
                                {chat.members.length} members
                            </span>
                        )}
                    </Col>
                </div>
            )}
            <Col className='small-menu-col mx-2'>
                <ChatSmallMenu chat={chat} setChat={setChat} setChats={setChats} />
            </Col>

        </Row >
    )
}

export default ChatHeader