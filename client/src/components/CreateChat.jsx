import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Container, Image, Stack, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { AESEncrypt } from '../crypto';
import { useAuth } from '../components/AuthContext';
import CreateImage from './CreateImage';
import UploadChatAvatarModal from './UploadChatAvatarModal';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function CreateChat({ newChatVisibility }) {
    const { authUser } = useAuth();
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [chatName, setChatName] = useState('');
    const [imageURL, setImageURL] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);

    useEffect(() => {
        axios.get(`${API_SERVER}/users/${authUser.nickname}/friends`, { withCredentials: true })
            .then(response => {
                setFriends(response.data);
                setFilteredFriends(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [authUser, setFriends]);

    const handleSelectFriend = useCallback((e, friend) => {
        const friendContainer = e.target.closest('.friend-container');
        const checkbox = friendContainer.querySelector('input[type="checkbox"]');
        const label = friendContainer.querySelector('.rounded-checkbox-label');

        if (checkbox) {
            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                // Friend added
                label.classList.add('checked');
                setSelectedFriends(prev => {
                    return [...prev, friend.nickname];
                });
            } else {
                // Friend removed
                label.classList.remove('checked');
                setSelectedFriends(prev => {
                    return prev.filter(nickname => nickname !== friend.nickname);
                });
            }
        }
    }, [setSelectedFriends]);

    const handleFriendSearch = (e) => {
        const search = e.target.value;
        setFilteredFriends(friends.filter(friend => {
            return friend.firstName.toLowerCase().includes(search.toLowerCase())
                || friend.lastName.toLowerCase().includes(search.toLowerCase());
        }));
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCreateChat = () => {
        if (chatName) {
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

            axios.post(`${API_SERVER}/chats`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    navigate(`/messenger?c=${AESEncrypt(response.data.id)}`);
                    newChatVisibility(false);
                })
                .catch(error => {
                    console.error(error);
                });
        }
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
                <Col className='me-4' xs lg={2}>
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
                <Col xs>
                    <input
                        type='text'
                        placeholder='Enter a chat name'
                        className='chat-name'
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                    />
                </Col>
            </Row>
            <Row className='search-friend'>
                <input
                    type='text'
                    placeholder='Enter friend’s name or surname'
                    className='px-4 py-3 border-1'
                    onChange={handleFriendSearch}
                />
            </Row>
            <Stack className='friend-list flex-grow-1 my-3' direction='vertical' gap={2}>
                {filteredFriends.map((friend, index) => (
                    <Button
                        key={index}
                        variant='light'
                        title='friend'
                        className="friend-container d-flex align-items-center border-0 px-4"
                        onClick={(e) => handleSelectFriend(e, friend)}
                    >
                        <div className="friend-info w-75 d-flex align-items-center">
                            <CreateImage
                                url={friend.avatarUrl}
                                alt={'Friend'}
                                width={35}
                                height={35}
                                rounded={true}
                            />
                            <span className='friend-name ms-3'>{friend.firstName} {friend.lastName}</span>
                        </div>
                        <div className="friend-add w-25 d-flex justify-content-end align-items-center">
                            <label className={`rounded-checkbox-label d-flex align-items-center justify-content-center ${selectedFriends.includes(friend.nickname) ? 'checked' : ''}`}>
                                <input
                                    title='add-friend'
                                    type="checkbox"
                                    name="friend"
                                    className='d-none'
                                    checked={selectedFriends.includes(friend.nickname)}
                                    onChange={(e) => handleSelectFriend(e, friend)}
                                />
                            </label>
                        </div>
                    </Button>
                ))}
            </Stack>

            {selectedFriends.length > 0 || chatName !== '' ? (
                <Row className='create-chat-footer d-flex justify-content-end align-items-center py-3 px-4'>
                    <Button variant='light' className='w-auto me-3'>Cancel</Button>
                    {chatName !== '' ? (
                        <Button variant='primary' className='w-auto' onClick={handleCreateChat}>Create chat</Button>
                    ) : (
                        <>
                            {selectedFriends.length === 1 ? (
                                <Button variant='primary' className='w-auto' onClick={handleCreateChat}>Open chat</Button>
                            ) : null}
                            {selectedFriends.length > 1 ? (
                                <Button variant='primary' className='w-auto' onClick={handleCreateChat}>Create chat</Button>
                            ) : null}
                        </>
                    )}
                </Row>
            ) : null}
        </Container >
    )
}

export default CreateChat