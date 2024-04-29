import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from './AuthContext';

import { ReactComponent as Return } from '../assets/icons/return.svg';
import { ReactComponent as Cross } from '../assets/icons/cross-icon.svg';
import { ReactComponent as NoSound } from '../assets/icons/no-sound.svg';
import { ReactComponent as Sound } from '../assets/icons/sound.svg';
import { ReactComponent as Trash } from '../assets/icons/trash.svg';

function ChatSmallMenu({ chat, setChat }) {
    const { authUser } = useAuth();
    const navigate = useNavigate();

    // Return the user to the chat
    const handleReturnToChat = () => {
        axios.patch(`${API_SERVER}/chats/${chat.id}/return`, {}, { withCredentials: true })
            .then((response) => {
                setChat({ ...response.data });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleLeaveChat = () => {
        axios.delete(`${API_SERVER}/chats/${chat.id}/leave`, { withCredentials: true })
            .then(() => {
                navigate('/messenger');
                window.location.reload();
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDisableNotifications = () => {
        // TODO: Implement the functionality to disable notifications
    };

    const handleClearHistory = () => {
        // TODO: Implement the functionality to clear the chat history
    };

    return (
        <Container className='small-menu d-flex flex-column py-3 px-4'>
            <Row className='menu-option' onClick={handleDisableNotifications}>
                <Col className='option-icon'>
                    <NoSound className='nosound-icon' />
                </Col>
                <Col className='option-text'>Disable notifications</Col>
            </Row>
            <Row className='menu-option' onClick={handleClearHistory}>
                <Col className='option-icon'>
                    <Trash className='trash-icon' />
                </Col>
                <Col className='option-text'>Clear message history</Col>
            </Row>

            {chat.type === 'group' && (
                <>
                    {chat.members == null ? (
                        <Row className='menu-option' onClick={handleReturnToChat}>
                            <Col className='option-icon'>
                                <Return className='return-icon' />
                            </Col>
                            <Col className='option-text'>Return to chat</Col>
                        </Row>
                    ) : (
                        <Row className='menu-option' onClick={handleLeaveChat}>
                            <Col className='option-icon'>
                                <Cross className='cross-icon' />
                            </Col>
                            <Col className='option-text'>Leave chat</Col>
                        </Row>
                    )}
                </>
            )}
        </Container>
    )
}

export default ChatSmallMenu