import React, { useState, useEffect } from 'react';
import { Stack, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import ChatPreview from './ChatPreview';
import ChatMenuHeader from './ChatMenuHeader';
import ChatTypeFilter from './ChatTypeFilter';
import CreateChat from './CreateChat';
import GroupChatMenu from './GroupChatMenu';

function ChatMenu({ chats, chat, setChat, subscription, handleMenuChange, activeMenu }) {
    const navigate = useNavigate();
    const [filteredChats, setFilteredChats] = useState([]);
    const [selectedChatType, setSelectedChatType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const getSearch = (search) => {
        setSearchQuery(search);
        if (search === '') {
            return setFilteredChats(chats.filter(chat => {
                return chat.lastMessage !== null && (selectedChatType === 'all' || chat.type === selectedChatType)
            }));
        }
        const filteredChatList = chats.filter(chat => {
            return chat.name.toLowerCase().includes(search.toLowerCase()) && (selectedChatType === 'all' || chat.type === selectedChatType)
        });
        setFilteredChats(filteredChatList);
    };

    useEffect(() => {
        const filteredChatList = chats.filter(chat => chat.lastMessage !== null);
        setFilteredChats(filteredChatList);
    }, [chats]);

    return (
        <Container className='chat-menu'>

            <ChatMenuHeader
                getSearch={getSearch}
                changeMenu={handleMenuChange}
                activeMenu={activeMenu}
                setChat={setChat}
                subscription={subscription}
            />

            {activeMenu === 'DEFAULT' ? (
                // Default view with chat previews
                <>
                    <ChatTypeFilter
                        setFilteredChats={setFilteredChats}
                        setSelectedChatType={setSelectedChatType}
                        chats={chats}
                        searchQuery={searchQuery}
                    />

                    <Stack direction='vertical'>
                        {filteredChats.map(chatElement => (
                            <ChatPreview
                                chat={chatElement}
                                chosenChat={chat}
                                navigate={navigate}
                                key={chatElement.id}
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