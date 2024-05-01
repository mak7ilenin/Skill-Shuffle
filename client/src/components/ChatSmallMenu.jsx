import React, { useCallback, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { AESDecrypt } from "../crypto";
import SmallMenuModal from './SmallMenuModal';

import { ReactComponent as Return } from '../assets/icons/return.svg';
import { ReactComponent as Cross } from '../assets/icons/cross-icon.svg';
import { ReactComponent as NoSound } from '../assets/icons/no-sound.svg';
import { ReactComponent as Sound } from '../assets/icons/sound.svg';
import { ReactComponent as Trash } from '../assets/icons/trash.svg';

function ChatSmallMenu({ chat, setChat, setChats }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(!chat.muted);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleShowModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setModalContent('');
        setShowModal(false);
    };

    // Handle the modal action button click
    const handleActionClick = (content) => {
        switch (content) {
            case 'leave':
                handleLeaveChat();
                break;
            case 'clear':
                handleClearHistory();
                break;
            default:
                break;
        }
        handleCloseModal();
    };

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

    const toggleNotifications = useCallback((state) => {
        axios.patch(`${API_SERVER}/chats/${chat.id}/notifications?s=${state}`, {}, { withCredentials: true })
            .then(() => {
                setNotifications(state);
                setChat(prevChat => {
                    return {
                        ...prevChat,
                        muted: !state
                    };
                });
                setChats(prevChats => prevChats.map(prevChat => {
                    if (AESDecrypt(prevChat.id) === String(chat.id)) {
                        return {
                            ...prevChat,
                            muted: !state
                        };
                    }
                    return prevChat;
                }));
            })
            .catch(error => {
                console.error(error);
            });
    }, [chat, setChat, setChats]);

    const handleClearHistory = () => {
        axios.patch(`${API_SERVER}/chats/${chat.id}/clear`, {}, { withCredentials: true })
            .then(() => {
                navigate('/messenger');
                window.location.reload();
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Container className='small-menu d-flex flex-column py-3 px-4'>

            {showModal && (
                <SmallMenuModal
                    showModal={showModal}
                    closeModal={handleCloseModal}
                    content={modalContent}
                    handleActionClick={handleActionClick}
                />
            )}

            {notifications ? (
                <Row className='menu-option' onClick={() => toggleNotifications(false)}>
                    <Col className='option-icon'>
                        <NoSound className='nosound-icon' />
                    </Col>
                    <Col className='option-text'>Disable notifications</Col>
                </Row>
            ) : (
                <Row className='menu-option' onClick={() => toggleNotifications(true)}>
                    <Col className='option-icon'>
                        <Sound className='sound-icon' />
                    </Col>
                    <Col className='option-text'>Enable notifications</Col>
                </Row>
            )}
            <Row className='menu-option' onClick={() => handleShowModal('clear')}>
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
                        <Row className='menu-option' onClick={() => handleShowModal('leave')}>
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