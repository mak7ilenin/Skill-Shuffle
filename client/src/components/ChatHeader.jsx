import React, { useState } from 'react';
import { Row, Col, Image, NavLink, Button } from 'react-bootstrap';

import ChatSmallMenu from './ChatSmallMenu';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as NetworkIcon } from '../assets/icons/network.svg';
import { ReactComponent as Menu } from '../assets/icons/post-menu.svg';

function ChatHeader({ chat, setChat, handleMenuChange }) {
    const [smallMenuVisibility, setSmallMenuVisibility] = useState(false);

    const generateLink = () => {
        switch (chat.type) {
            case 'private':
                return `/users?nn=${chat.members[0].nickname}`;
            case 'community':
                return `/communities?nn=${chat.community.nickname}`;
            default:
                return '/';
        }
    }

    const handeShowSmallMenu = (state) => {
        setSmallMenuVisibility(state);
        document.querySelector('.small-menu-col .menu-btn').classList.toggle('active');
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
    }

    return (
        <Row className='chat-header'>
            <Col className='info-container'>
                {chat.type !== 'group' ? (
                    <NavLink href={generateLink()} className='chat-info d-flex'>
                        <Col className='chat-avatar me-3' role='button'>
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
                            <p role='button' className='chat-name'>{chat.name}</p>

                            {chat.type === 'community' ? (
                                <span className='text-secondary'>Community</span>
                            ) : (
                                <p className='user-activity'>
                                    {formatLastSeenTimestamp(chat.members[0].lastSeen) === 'Online' ? (
                                        <>
                                            <div className="online-icon rounded-circle"></div>
                                            <span>Online</span>
                                        </>
                                    ) : (
                                        <>
                                            <NetworkIcon className='network-icon' />
                                            <span className='text-secondary'>{formatLastSeenTimestamp(chat.members[0].lastSeen)}</span>
                                        </>
                                    )}
                                </p>
                            )}
                        </Col>
                    </NavLink>
                ) : (
                    <div
                        className='chat-info d-flex p-0'
                        onClick={() => {
                            // If user is left, then hide group chat information
                            if (chat.members !== null) {
                                handleMenuChange('GROUP_MENU')
                            };
                        }}
                    >
                        <Col className='chat-avatar me-3' role='button'>
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
                            <p role='button' className='chat-name'>{chat.name}</p>
                            {chat.members !== null && <span role='button' className='text-secondary'>{chat.members.length} members</span>}
                        </Col>
                    </div>
                )}
            </Col>
            <Col className='small-menu-col d-flex flex-column justify-content-end position-absolute'
                onMouseOver={() => handeShowSmallMenu(true)}
                onMouseOut={() => handeShowSmallMenu(false)}
            >
                <Button variant='link' className='menu-btn d-flex justify-content-end py-3'>
                    <Menu className='menu-icon' />
                </Button>
                {smallMenuVisibility && (
                    <ChatSmallMenu
                        setSmallMenuVisibility={setSmallMenuVisibility}
                        chat={chat}
                        setChat={setChat}
                    />
                )}
            </Col>

        </Row >
    )
}

export default ChatHeader