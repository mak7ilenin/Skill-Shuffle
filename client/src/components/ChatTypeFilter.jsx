import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

function ChatTypeFilter({ setFilteredChats, setSelectedChatType, chats, searchQuery }) {
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        setChatList(chats.filter(chat => chat.lastMessage !== null));
    }, [chats]);

    const filterChatsByType = (type, e) => {
        setSelectedChatType(type);
        const chatTypes = document.querySelectorAll('.chat-type');
        chatTypes.forEach(chatType => chatType.classList.remove('active'));
        e.target.parentElement.classList.add('active');

        if (type === 'all') {
            if (searchQuery === '') {
                return setFilteredChats(chatList);
            }
            setFilteredChats(chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase())));
        } else {
            setFilteredChats(chatList.filter(chat => chat.type === type && chat.name.toLowerCase().includes(searchQuery.toLowerCase())));
        }
    };

    const defaultChatTypes = [
        { type: 'private', name: 'Contacts' },
        { type: 'group', name: 'Groups' },
        { type: 'community', name: 'Communities' }
    ];

    const existingChatTypes = defaultChatTypes.filter(chatType => chatList.some(chat => chat.type === chatType.type));

    return (
        <Row className='chat-types d-flex'>
            <Col className='chat-type active' onClick={(e) => filterChatsByType('all', e)}>
                <p>All</p>
            </Col>
            {existingChatTypes.map((chatType, index) => (
                <Col key={index} className='chat-type' onClick={(e) => filterChatsByType(chatType.type, e)}>
                    <p>{chatType.name}</p>
                </Col>
            ))}
        </Row>
    )
}

export default ChatTypeFilter