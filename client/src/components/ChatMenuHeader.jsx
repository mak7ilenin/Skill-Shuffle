import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as NewChatIcon } from '../assets/icons/create-chat.svg';
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

function ChatMenuHeader({ getSearch, changeMenu, activeMenu, setChat, subscription }) {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearch(e.target.value);
        getSearch(e.target.value);
    };

    const handleCross = () => {
        setSearch('');
        getSearch('');
        document.querySelector('.chat-menu-header').classList.remove('active-search');
    };

    return (
        <Row className='chat-menu-header w-100 d-flex'>
            <Col
                className='header-name'
                onClick={() => {
                    setChat(null);
                    subscription.current.unsubscribe();
                    navigate('/messenger');
                    changeMenu('DEFAULT');
                }}
            >
                Messages
            </Col>
            <Col className='search-btn me-2'>
                <Button
                    variant='none'
                    onClick={() => document.querySelector('.chat-menu-header').classList.add('active-search')}
                >
                    <IoSearch color='white' size={27} />
                </Button>
            </Col>
            <Col className={`search-bar-container mx-4 d-flex w-auto ${activeMenu !== 'DEFAULT' ? 'invisible' : 'visible'}`}>
                <div className={`search-bar w-auto d-flex align-items-center ${search !== '' ? 'active' : ''}`}>
                    <IoSearch color='white' size={18} className='search-icon' />
                    <input
                        type='text'
                        placeholder='Search'
                        value={search}
                        autoFocus
                        onChange={handleSearch}
                    />
                    <RxCross2 className='cross-icon' onClick={handleCross} />
                </div>
            </Col>
            <Col className='create-chat'>
                {activeMenu === 'DEFAULT' ? (
                    <button className='d-flex align-items-center justify-content-center'
                        onClick={() => changeMenu('CREATE_CHAT')}>
                        <NewChatIcon className='new-icon' />
                    </button>
                ) : (
                    <button className='d-flex align-items-center justify-content-center'
                        onClick={() => changeMenu('DEFAULT')}>
                        <RxCross2 className='cross-icon' />
                    </button>
                )}
            </Col>
        </Row>
    );
}

export default ChatMenuHeader;