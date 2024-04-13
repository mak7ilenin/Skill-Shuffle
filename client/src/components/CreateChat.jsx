import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Image, Stack, Button } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from '../components/AuthContext';
import CreateImage from './CreateImage';
import UploadChatAvatarModal from './UploadChatAvatarModal';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function CreateChat() {
    const { authUser } = useAuth();
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleFriendClick = (e) => {
        const friendContainer = e.target.closest('.friend-container');
        const checkbox = friendContainer.querySelector('input[type="checkbox"]');
        const label = friendContainer.querySelector('.rounded-checkbox-label');

        if (checkbox) {
            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                // Friend added
                label.classList.add('checked');
            } else {
                // Friend removed
                label.classList.remove('checked');
            }
        }
    };

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

    return (
        <Container className='new-chat d-flex flex-column'>

            <UploadChatAvatarModal showModal={showModal} setShowModal={setShowModal} setImageURL={setImageURL} />

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
                        onClick={handleFriendClick}
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
                            <label className="rounded-checkbox-label d-flex align-items-center justify-content-center">
                                <input title='add-friend' type="checkbox" name="friend" className='d-none' />
                            </label>
                        </div>
                    </Button>
                ))}
            </Stack>

            <Row className='create-chat-footer d-flex justify-content-end align-items-center py-3 px-4'>
                <Button variant='light' className='w-auto me-3'>Cancel</Button>
                <Button variant='primary' className='w-auto'>Create group</Button>
            </Row>
        </Container>
    )
}

export default CreateChat