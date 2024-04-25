import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ReactComponent as Return } from '../assets/icons/return.svg';

function ChatSmallMenu() {
    return (
        <Container className='small-menu d-flex flex-column py-3 px-4'>
            <Row className='menu-option'>
                <Col className='option-icon'>
                    <Return className='return-icon' />
                </Col>
                <Col className='option-text'>Return to chat</Col>
            </Row>
        </Container>
    )
}

export default ChatSmallMenu