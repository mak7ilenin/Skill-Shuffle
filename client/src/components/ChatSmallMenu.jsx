import React, { useCallback, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { AESDecrypt } from "../crypto";
import SmallMenuModal from './SmallMenuModal';

import { IoMdMore } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdVolumeOff } from "react-icons/io";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { TbArrowBackUp } from "react-icons/tb";

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
        <Dropdown bsPrefix='custom-primary-dropdown' autoClose>
            <Dropdown.Toggle className='d-flex align-items-center flex-row' title='More' >
                <IoMdMore className='more-btn' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {showModal && (
                    <SmallMenuModal
                        showModal={showModal}
                        closeModal={handleCloseModal}
                        content={modalContent}
                        handleActionClick={handleActionClick}
                    />
                )}

                {notifications ? (
                    <Dropdown.Item as={Button} onClick={() => toggleNotifications(false)}>
                        <IoMdVolumeOff size={16} className='nosound-icon' />
                        Disable notifications
                    </Dropdown.Item>
                ) : (
                    <Dropdown.Item as={Button} onClick={() => toggleNotifications(true)}>
                        <IoVolumeMediumSharp size={16} className='sound-icon' />
                        Enable notifications
                    </Dropdown.Item>
                )}
                <Dropdown.Item as={Button} onClick={() => handleShowModal('clear')}>
                    <FaTrashAlt size={16} className='trash-icon' />
                    Clear message history
                </Dropdown.Item>

                {chat.type === 'group' && (
                    <>
                        {chat.members == null ? (
                            <Dropdown.Item as={Button} onClick={handleReturnToChat}>
                                <TbArrowBackUp size={16} className='return-icon' />
                                Return to chat
                            </Dropdown.Item>
                        ) : (
                            <Dropdown.Item as={Button} onClick={() => handleShowModal('leave')}>
                                <RxCross2 size={16} className='cross-icon' />
                                Leave chat
                            </Dropdown.Item>
                        )}
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ChatSmallMenu