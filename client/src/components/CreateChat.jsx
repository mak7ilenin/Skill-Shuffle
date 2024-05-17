import React, { useState } from 'react';
import { Row, Col, Container, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { AESEncrypt } from '../crypto';
import UploadChatAvatarModal from './UploadChatAvatarModal';
import AddFriends from './AddFriends';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';

function CreateChat({ changeMenu }) {
    const navigate = useNavigate();
    const [chatName, setChatName] = useState('');
    const [imageURL, setImageURL] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCreateChat = () => {
        let chatType;
        if (chatName !== '') {
            chatType = 'group';
        } else {
            chatType = selectedFriends.length === 1 ? 'private' : 'group';
        }

        const newChat = {
            name: chatName,
            type: chatType,
            members: selectedFriends,
        }

        const formData = new FormData();
        formData.append('chat', JSON.stringify(newChat));

        // Check if an image file is selected
        if (imageBlob) {
            formData.append('avatarBlob', imageBlob);
        }

        axios.post(`${API_SERVER}/chats`, formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                navigate(`/messenger?c=${AESEncrypt(response.data.id)}`);
                changeMenu('DEFAULT');
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Container className='new-chat d-flex flex-column'>

            <UploadChatAvatarModal
                showModal={showModal}
                setShowModal={setShowModal}
                setImageURL={setImageURL}
                setImageBlob={setImageBlob}
            />

            <Row className='chat-header d-flex justify-content-start py-3 px-4'>
                <Col className='me-4 chat-avatar' xs lg={2}>
                    <div className="img-overlay d-flex align-items-center justify-content-center w-100 h-100 position-absolute top-0 rounded-circle" onClick={handleOpenModal}>
                        <Plus width={30} height={30} />
                    </div>
                    <Image
                        src={imageURL || imagePlaceholder}
                        alt='Chat'
                        width='80'
                        height='80'
                        role='button'
                        className='rounded-circle object-fit-cover'
                        onClick={handleOpenModal}
                    />
                </Col>
                <Col className='d-flex align-items-center' xs>
                    <input
                        type='text'
                        placeholder='Enter a chat name'
                        className='chat-name'
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                    />
                </Col>
            </Row>

            <AddFriends selectedFriends={selectedFriends} setSelectedFriends={setSelectedFriends} />

            {selectedFriends.length > 0 || chatName !== '' ? (
                <Row className='create-chat-footer d-flex justify-content-end align-items-center px-4'>
                    <Button variant='light' className='w-auto' onClick={() => changeMenu('DEFAULT')}>Cancel</Button>
                    {chatName !== '' ? (
                        <Button variant='primary' className='w-auto ms-3' onClick={handleCreateChat}>Create chat</Button>
                    ) : (
                        <>
                            {selectedFriends.length === 1 ? (
                                <Button variant='primary' className='w-auto ms-3' onClick={handleCreateChat}>Open chat</Button>
                            ) : null}
                            {selectedFriends.length > 1 ? (
                                <Button variant='primary' className='w-auto ms-3' onClick={handleCreateChat}>Create chat</Button>
                            ) : null}
                        </>
                    )}
                </Row>
            ) : null}
        </Container >
    )
}

export default CreateChat