import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';

import { ReactComponent as Return } from '../assets/icons/return.svg';

function ChatSmallMenu({ chat, setChat }) {
    const handleReturnToChat = () => {
        axios.patch(`${API_SERVER}/chats/${chat.id}/return`, {}, { withCredentials: true })
            .then((response) => {
                setChat({ ...chat, members: response.data.members });
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Container className='small-menu d-flex flex-column py-3 px-4'>
            <Row className='menu-option' onClick={handleReturnToChat}>
                <Col className='option-icon'>
                    <Return className='return-icon' />
                </Col>
                <Col className='option-text'>Return to chat</Col>
            </Row>
        </Container>
    )
}

export default ChatSmallMenu