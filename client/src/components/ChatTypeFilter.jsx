import React from 'react';
import { Row, Col } from 'react-bootstrap';

function ChatTypeFilter({ setChats, chats }) {
    const filterChatsByType = (type, e) => {
        const chatTypes = document.querySelectorAll('.chat-type');
        chatTypes.forEach(chatType => chatType.classList.remove('active'));
        e.target.parentElement.classList.add('active');

        if (type === 'all') {
            setChats(chats);
        } else {
            const filteredChats = chats.filter(chat => chat.type === type);
            setChats(filteredChats);
        }
    };

    const defaultChatTypes = [
        { type: 'private', name: 'Contacts' },
        { type: 'group', name: 'Groups' },
        { type: 'community', name: 'Communities' }
    ];

    const existingChatTypes = defaultChatTypes.filter(chatType => chats.some(chat => chat.type === chatType.type));

    return (
        <Row className='chat-types d-flex'>
            <Col className='chat-type active' onClick={(e) => filterChatsByType('all', e)}>
                <p>All&nbsp;({chats.length})</p>
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