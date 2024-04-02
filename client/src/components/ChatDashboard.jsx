import React, { useState } from 'react';
import { Offcanvas, Row, Col } from 'react-bootstrap';

function ChatDashboard({ chat, createImage }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Row className='chat-header'>
                <Col className='chat-avatar me-3' role='button' onClick={handleShow}>
                    {createImage(chat.avatar_url, chat.name, 55, 55)}
                </Col>
                <Col className='d-flex flex-column'>
                    <p role='button' onClick={handleShow} className='chat-name'>{chat.name}</p>
                    {chat.type === 'community' ? (
                        <span role='button' onClick={handleShow} className='text-secondary user-select-auto'>Community</span>
                    ) : chat.type === 'group' ? (
                        <span role='button' onClick={handleShow} className='text-secondary user-select-auto'>Group</span>
                    ) : (
                        <span role='button' onClick={handleShow} className='text-secondary user-select-auto'>Direct Message</span>
                    )}
                </Col>
            </Row>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Chat</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p>Chat content</p>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default ChatDashboard;