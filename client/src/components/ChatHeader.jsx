import React from 'react';
import { Row, Col } from 'react-bootstrap';

import CreateImage from './CreateImage';

import { ReactComponent as NetworkIcon } from '../assets/icons/network.svg';

function ChatHeader({ chat, openChatMenu }) {


    return (
        <Row className='chat-header'>
            {chat.type === 'community' ? (
                <>
                    <Col className='chat-avatar me-3' role='button'>
                        <CreateImage
                            url={chat.avatar_url}
                            alt={chat.name}
                            width={55}
                            height={55}
                            rounded={true}
                        />
                    </Col>
                    <Col className='d-flex flex-column'>
                        <p role='button' className='chat-name'>{chat.name}</p> {/* Community name */}
                        <span className='text-secondary'>Community</span>
                    </Col>
                </>
            ) : chat.type === 'group' ? (
                <>
                    <Col className='chat-avatar me-3' role='button' onClick={openChatMenu}>
                        <CreateImage
                            url={chat.avatar_url}
                            alt={chat.name}
                            width={55}
                            height={55}
                            rounded={true}
                        />
                    </Col>
                    <Col className='d-flex flex-column'>
                        <p role='button' onClick={openChatMenu} className='chat-name'>{chat.name}</p>
                        <span role='button' onClick={openChatMenu} className='text-secondary'>4 members</span> {/* Number of members */}
                    </Col>
                </>
            ) : (
                <>
                    <Col className='chat-avatar me-3' role='button'>
                        <CreateImage
                            url={chat.avatar_url}
                            alt={chat.name}
                            width={55}
                            height={55}
                            rounded={true}
                        />
                    </Col>
                    <Col className='d-flex flex-column'>
                        <p role='button' className='chat-name'>{chat.name}</p> {/* User name */}
                        <p className='user-activity'>
                            <NetworkIcon className='network-icon' />
                            <span className='text-secondary'>last seen at 21:54</span> {/* User last seen */}
                        </p>
                    </Col>
                </>
            )}
        </Row>
    )
}

export default ChatHeader