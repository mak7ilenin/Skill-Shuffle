import React, { useState } from 'react';
import { Stack, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import ChatPreview from './ChatPreview';
import ChatMenuHeader from './ChatMenuHeader';
import ChatTypeFilter from './ChatTypeFilter';
import CreateChat from './CreateChat';

function ChatMenu({ chats, setFilteredChats, filteredChats, choosenChat }) {
    const navigate = useNavigate();
    const [newChatVisibility, setNewChatVisibility] = useState(false);

    const getSearch = (search) => {
        setFilteredChats(chats.filter(chat => chat.name.toLowerCase().includes(search.toLowerCase())));
    };

    const handleCreateChat = (state) => {
        setNewChatVisibility(state);
    };

    return (
        <Container className='chat-menu'>

            <ChatMenuHeader getSearch={getSearch} createChat={handleCreateChat} />

            {!newChatVisibility ? (
                // Default view with chat previews
                <>
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
                </>
            ) : (
                // Create chat view
                <CreateChat />
            )}

        </Container>
    )
}

export default ChatMenu