import React from 'react';
import { Stack, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import ChatPreview from './ChatPreview';
import ChatMenuHeader from './ChatMenuHeader';
import ChatTypeFilter from './ChatTypeFilter';
import CreateChat from './CreateChat';
import GroupChatMenu from './GroupChatMenu';

function ChatMenu({ chats, chat, setChat, setFilteredChats, filteredChats, handleMenuChange, activeMenu }) {
    const navigate = useNavigate();

    const getSearch = (search) => {
        setFilteredChats(chats.filter(chat => chat.name.toLowerCase().includes(search.toLowerCase())));
    };

    return (
        <Container className='chat-menu'>

            <ChatMenuHeader
                getSearch={getSearch}
                changeMenu={handleMenuChange}
                activeMenu={activeMenu}
            />

            {activeMenu === 'DEFAULT' ? (
                // Default view with chat previews
                <>
                    <ChatTypeFilter setChats={setFilteredChats} chats={chats} />
                    <Stack direction='vertical'>
                        {filteredChats.map(chatElement => (
                            <ChatPreview
                                chat={chatElement}
                                chosenChat={chat}
                                navigate={navigate}
                                key={chat.id}
                            />
                        ))}
                    </Stack>
                </>
            ) : null}
            {activeMenu === 'CREATE_CHAT' ? (
                // Create chat view
                <CreateChat changeMenu={handleMenuChange} />
            ) : null}
            {activeMenu === 'GROUP_MENU' ? (
                // Group menu view
                <GroupChatMenu chat={chat} setChat={setChat} />
            ) : null}

        </Container>
    )
}

export default ChatMenu