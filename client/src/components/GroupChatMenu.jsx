import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Image, Stack, Button } from 'react-bootstrap';
import axios from 'axios';

import UploadChatAvatarModal from './UploadChatAvatarModal';
import { API_SERVER } from '../config';

import { ReactComponent as NetworkIcon } from '../assets/icons/network.svg';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';
import { ReactComponent as Search } from '../assets/icons/search-icon.svg';
import { ReactComponent as Cross } from '../assets/icons/cross-icon.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function GroupChatMenu({ chat }) {
    const [showModal, setShowModal] = useState(false);
    const [imageURL, setImageURL] = useState(chat.avatarUrl || null);
    const [imageBlob, setImageBlob] = useState(null);
    const [filteredMembers, setFilteredMembers] = useState(chat.members);
    const [searchMemberVisibility, setSearchMemberVisibility] = useState('');

    const handleMemberFilter = (e) => {
        // Filter members based on the role
        const filter = e.target.getAttribute('data-role');
        setFilteredMembers(chat.members.filter(member => member.role === filter || member.role === 'creator'));

        // Remove active class from all buttons
        document.querySelectorAll('.members-filter button').forEach(button => button.classList.remove('active'));
        e.target.classList.add('active');
    };

    const handleMemberSearch = (e) => {
        setFilteredMembers(chat.members.filter(member => {
            return member.firstName.toLowerCase().includes(e.target.value.toLowerCase())
                || member.lastName.toLowerCase().includes(e.target.value.toLowerCase())
        }));
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Get the imageBlob from the modal and send it to the server
    useEffect(() => {
        if (imageBlob !== null) {
            const formData = new FormData();
            formData.append('avatarBlob', imageBlob);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            };

            axios.patch(`${API_SERVER}/chats/${chat.id}/avatar`, formData, config)
                .then(response => {
                    setImageURL(response.data.avatarUrl);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [imageBlob, chat.id]);

    return (
        <Container className='group-menu d-flex flex-column'>

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
                    <p className='chat-name'>{chat.name}</p>
                    <p className='members-count'>{chat.members.length} members</p>
                </Col>
            </Row>

            <Row className='members-filter d-flex justify-content-start align-items-center position-relative ps-3'>
                {!searchMemberVisibility ? (
                    <>
                        <Button variant='light' className='all-members active' data-role='member' onClick={handleMemberFilter}>
                            All members <span className='ms-2'>{chat.members.length}</span>
                        </Button>

                        <Button variant='light' className='admins' data-role='admin' onClick={handleMemberFilter}>
                            Administrators
                            <span className='ms-2'>{chat.members.filter(member => member.role === 'admin' || member.role === 'creator').length}</span>
                        </Button>

                        <Col className='d-flex justify-content-end align-items-center'>
                            <Button variant='none' className='icon-btn search-btn px-3' onClick={() => setSearchMemberVisibility(true)}>
                                <Search className='search-icon' width={22} height={22} />
                            </Button>
                        </Col>
                    </>
                ) : (
                    <>
                        <input
                            type='text'
                            placeholder='Enter member’s name or surname'
                            className='border-0'
                            autoFocus={true}
                            onKeyDown={handleMemberSearch}
                        />
                        <Button variant='none' className='icon-btn cross-btn px-3' onClick={() => setSearchMemberVisibility(false)}>
                            <Cross className='cross-icon' width={10} height={10} />
                        </Button>
                    </>
                )}
            </Row>

            <Stack className='member-list flex-grow-1 my-3' direction='vertical' gap={2}>
                {filteredMembers.map((member, index) => (
                    <Row
                        key={index}
                        className="member-container d-flex align-items-center border-0 px-4 my-2"
                    >
                        <div className="member-info w-75 d-flex align-items-center">
                            <Image
                                src={member.avatarUrl !== null ? member.avatarUrl : imagePlaceholder}
                                alt={'Member'}
                                width='35'
                                height='35'
                                style={{ objectFit: 'cover' }}
                                roundedCircle
                            />
                            <span className='member-name ms-3'>{member.firstName} {member.lastName}</span>
                        </div>
                        {/* <div className="friend-add w-25 d-flex justify-content-end align-items-center">
                            <Plus />
                        </div> */}
                    </Row>
                ))}
            </Stack>

        </Container>
    )
}

export default GroupChatMenu