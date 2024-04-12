import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ReactComponent as NewChatIcon } from '../assets/icons/create-chat.svg';
import { ReactComponent as Search } from '../assets/icons/search-icon.svg';
import { ReactComponent as Cross } from '../assets/icons/cross-icon.svg';

function ChatMenuHeader({ getSearch }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        // Update the search value
        setSearch(e.target.value);

        // Pass the search value to the parent component
        getSearch(e.target.value);
    };

    const handleCross = () => {
        // Clear the search value
        setSearch('');

        // Pass the search value to the parent component
        getSearch('');
    };

    return (
        <Row className='chat-menu-header w-100 d-flex'>
            <Col className='header-name'>
                Messages
            </Col>
            <Col className='search-bar-container mx-3 d-flex flex-grow-1 justify-content-center w-auto'>
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
                <button className='d-flex align-items-center justify-content-center'>
                    <NewChatIcon />
                </button>
            </Col>
        </Row>
    );
}

export default ChatMenuHeader;