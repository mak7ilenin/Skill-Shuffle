import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as NewChatIcon } from '../assets/icons/create-chat.svg';
import { ReactComponent as Search } from '../assets/icons/search-icon.svg';
import { ReactComponent as Cross } from '../assets/icons/cross-icon.svg';

function ChatMenuHeader({ getSearch, changeMenu, activeMenu, setChat }) {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearch(e.target.value);
        getSearch(e.target.value);
    };

    const handleCross = () => {
        setSearch('');
        getSearch('');
    };

    return (
        <Row className='chat-menu-header w-100 d-flex'>
            <Col
                className='header-name'
                onClick={() => {
                    setChat(null);
                    navigate('/messenger');
                    changeMenu('DEFAULT');
                }}
            >
                Messages
            </Col>
            <Col className={`search-bar-container mx-3 d-flex w-auto ${activeMenu !== 'DEFAULT' ? 'invisible' : 'visible'}`}>
                <div className={`search-bar w-auto d-flex align-items-center ${search !== '' ? 'active' : ''}`}>
                    <Search className='search-icon' />
                    <input
                        type='text'
                        placeholder='Search'
                        value={search}
                        onChange={handleSearch}
                    />
                    <Cross className='cross-icon' onClick={handleCross} />
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
                        <Cross className='cross-icon' />
                    </button>
                )}
            </Col>
        </Row>
    );
}

export default ChatMenuHeader;