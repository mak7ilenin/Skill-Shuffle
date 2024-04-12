import React from 'react';
import { Stack, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import ChatPreview from './ChatPreview';
import ChatMenuHeader from './ChatMenuHeader';
import ChatTypeFilter from './ChatTypeFilter';

function ChatMenu({ chats, setFilteredChats, filteredChats }) {
    const navigate = useNavigate();

    return (
        <Container className='chat-menu'>
            <ChatMenuHeader />
            <ChatTypeFilter setChats={setFilteredChats} chats={chats} />

            <Stack direction='vertical'>
                {filteredChats.map(chat => (
                    <ChatPreview
                        chat={chat}
                        navigate={navigate}
                        key={chat.id}
                    />
                ))}
            </Stack>
        </Container>
    )
}

export default ChatMenu