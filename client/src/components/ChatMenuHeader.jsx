import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ReactComponent as NewChatIcon } from '../assets/icons/create-chat.svg';
import { ReactComponent as Search } from '../assets/icons/search-icon.svg';

function ChatMenuHeader() {

    return (
        <Row className='chat-menu-header w-100 d-flex'>
            <Col className='header-name'>
                Messages
            </Col>
            <Col className='search-bar-container mx-3 d-flex flex-grow-1 justify-content-center w-auto'>
                <div className="search-bar w-auto d-flex align-items-center">
                    <Search className='search-icon' />
                    <input type='text' placeholder='Search' />
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