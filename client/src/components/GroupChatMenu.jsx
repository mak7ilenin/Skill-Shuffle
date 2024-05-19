import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Image, Stack, Button, Modal, Dropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from './AuthContext';
import UploadChatAvatarModal from './UploadChatAvatarModal';
import AddFriends from './AddFriends';
import { API_SERVER } from '../config';

import { ReactComponent as NetworkIcon } from '../assets/icons/network.svg';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';
import { ReactComponent as Search } from '../assets/icons/search-icon.svg';
import { ReactComponent as Grade } from '../assets/icons/grade.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { RxCross1 } from "react-icons/rx";
import { SlArrowDown } from "react-icons/sl";

function GroupChatMenu({ chat, setChat }) {
    const navigate = useNavigate();
    const { authUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [imageURL, setImageURL] = useState(chat.avatarUrl || null);
    const [imageBlob, setImageBlob] = useState(null);
    const [filteredMembers, setFilteredMembers] = useState(chat.members);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [search, setSearch] = useState('');
    const [searchMemberVisibility, setSearchMemberVisibility] = useState(false);
    const [addMemberVisibility, setAddMemberVisibility] = useState(false);
    const [leaveChatModalVisibility, setLeaveChatModalVisibility] = useState(false);

    const handleMemberFilter = (e) => {
        // Filter members based on the role
        const filter = e.target.getAttribute('data-role');
        setFilteredMembers(chat.members.filter(member => member.role === filter || member.role === 'creator'));

        // Remove active class from all buttons
        document.querySelectorAll('.members-filter button').forEach(button => button.classList.remove('active'));
        e.target.classList.add('active');
    };

    const handleMemberSearch = () => {
        if (search === '') {
            setFilteredMembers(chat.members);
            return;
        }
        setFilteredMembers(chat.members.filter(member => {
            return member.firstName.toLowerCase().includes(search.toLowerCase())
                || member.lastName.toLowerCase().includes(search.toLowerCase())
        }));
    };

    const handleAddMembers = () => {
        if (selectedFriends.length > 0) {
            axios.post(`${API_SERVER}/chats/${chat.id}/members`, selectedFriends, { withCredentials: true })
                .then((response) => {
                    setChat({ ...response.data });
                    setFilteredMembers(response.data.members);

                    // Reset everything and close
                    setAddMemberVisibility(false);
                    setSelectedFriends([]);
                    setSearch('');
                })
                .catch(error => {
                    console.error(error);
                });
        }
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

    const handleChangeMemberRole = (nickname, role) => {
        axios.patch(`${API_SERVER}/chats/${chat.id}/members?nickname=${nickname}&role=${role}`, {}, { withCredentials: true })
            .then(() => {
                const updatedMembers = chat.members.map(member => {
                    if (member.nickname === nickname) {
                        member.role = role;
                    }
                    return member;
                });
                setChat({ ...chat, members: updatedMembers });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleRemoveMember = (nickname) => {
        axios.delete(`${API_SERVER}/chats/${chat.id}/members?nickname=${nickname}`, { withCredentials: true })
            .then(() => {
                const updatedMembers = chat.members.filter(member => member.nickname !== nickname);
                setChat(prevChat => {
                    return {
                        ...prevChat,
                        members: updatedMembers
                    };
                });
                setFilteredMembers(updatedMembers);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const formatLastSeenTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const currentDate = new Date();
        const difference = currentDate - date;

        if (difference > 31536000000) {
            // dd/mmm/yyyy if the message was sent more than a year ago
            return `last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else if (difference > 86400000) {
            // dd/mmm if the message was sent less than a year ago but more than a day ago
            return `last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
        } else if (difference > 3600000) {
            // hh:mm if the message was sent less than a day ago and more than an hour ago
            return `last seen at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (difference > 300000) {
            // mm ago if message was sent more than 5 minutes
            return `last seen ${Math.floor(difference / 60000)} minutes ago`;
        } else {
            // If the message was sent less than 5 minutes ago then return 'Online'
            return 'Online';
        }
    }

    const isAdminOrCreator = () => {
        const isAdmin = chat.members.find(member => member.nickname === authUser.nickname && member.role === 'admin');
        const isCreator = chat.members.find(member => member.nickname === authUser.nickname && member.role === 'creator');
        return isAdmin || isCreator;
    };

    const isOwner = () => {
        return chat.members.find(member => member.nickname === authUser.nickname && member.role === 'creator');
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleOpenLeaveModal = () => {
        setLeaveChatModalVisibility(true);
    };

    const handleCloseLeaveModal = () => {
        setLeaveChatModalVisibility(false);
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

            <Modal className='leave-chat-modal' show={leaveChatModalVisibility} onHide={handleCloseLeaveModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Leave chat?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    If you leave, you won’t receive any new messages from this chat.
                    You can only return if there is enough room.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='light' onClick={handleCloseLeaveModal}>Cancel</Button>
                    <Button variant='danger' onClick={handleLeaveChat}>Leave chat</Button>
                </Modal.Footer>
            </Modal>

            <UploadChatAvatarModal
                showModal={showModal}
                setShowModal={setShowModal}
                setImageURL={setImageURL}
                setImageBlob={setImageBlob}
            />

            <Row className='chat-header d-flex justify-content-start py-3 px-4'>
                <Col className='me-4 chat-avatar'>
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
                    />
                </Col>
                <Col className='d-flex align-self-center flex-column'>
                    <p className='chat-name'>{chat.name}</p>
                    <p className='members-count'>{chat.members.length} members</p>
                </Col>
            </Row>

            {!addMemberVisibility ? (
                <>
                    <Row className='members-filter d-flex justify-content-start align-items-center position-relative ps-3'>
                        {!searchMemberVisibility ? (
                            <>
                                <Button variant='light' className='all-members active' data-role='member' onClick={handleMemberFilter}>
                                    All members <span className='ms-2'>{chat.members.length}</span>
                                </Button>

                                <Button variant='light' className='admins' data-role='admin' onClick={handleMemberFilter}>
                                    Administrators
                                    <span className='ms-2'>
                                        {chat.members.filter(member => member.role === 'admin' || member.role === 'creator').length}
                                    </span>
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
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyUp={handleMemberSearch}
                                />
                                <Button
                                    variant='none'
                                    className='icon-btn cross-btn px-3'
                                    onClick={() => {
                                        setSearchMemberVisibility(false);
                                        setSearch('');
                                        setFilteredMembers(chat.members);
                                    }}
                                >
                                    <RxCross1 className='cross-icon' width={10} height={10} />
                                </Button>
                            </>
                        )}
                    </Row>

                    <Row className='add-members px-3'>
                        <Button variant='light' className='d-flex align-items-center px-0 py-2' onClick={() => setAddMemberVisibility(true)}>
                            <div className='rounded-circle d-flex justify-content-center align-items-center'>
                                <Plus width={22} height={22} />
                            </div>
                            <span className='ms-2'>Add members</span>
                        </Button>
                    </Row>

                    <Stack className='member-list flex-grow-1' direction='vertical' gap={0}>
                        {filteredMembers && filteredMembers.map((member, index) => (
                            <div
                                key={index}
                                className="member-container d-flex align-items-center m-0 py-2 px-3"
                            >
                                <div className="member-info w-100 d-flex align-items-center px-0">
                                    <Image
                                        src={member.avatarUrl !== null ? member.avatarUrl : imagePlaceholder}
                                        alt={'Member'}
                                        width='55'
                                        height='55'
                                        style={{ objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => navigate(`/user?nn=${member.nickname}`)}
                                        roundedCircle
                                    />
                                    <div className='d-flex flex-row w-100 ms-3'>
                                        <div className='d-flex flex-column w-100'>
                                            <div className='d-flex flex-row'>
                                                <div className="member-name d-flex flex-row">
                                                    <Link to={`/users?nn=${member.nickname}`} className='name'>
                                                        {member.firstName} {member.lastName}
                                                    </Link>
                                                    {isOwner() && member.role !== 'creator' && (
                                                        <>
                                                            <i className='ms-1 me-2'>•</i>
                                                            <span className='member-role'>{member.role === 'admin' ? 'Administrator' : 'Member'}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {!isAdminOrCreator() || member.role === 'creator' ? (
                                                    <>
                                                        {member.role === 'creator' || member.role === 'admin' ? (
                                                            <Col className="d-flex justify-content-end align-items-center">
                                                                <span className='member-role'>{member.role === 'creator' ? 'Creator' : 'Administrator'}</span>
                                                            </Col>
                                                        ) : null}
                                                    </>
                                                ) : null}
                                            </div>
                                            <div className='member-activity d-flex align-items-center justify-content-start flex-row'>
                                                {formatLastSeenTimestamp(member.lastSeen) === 'Online' ? (
                                                    <>
                                                        <div className="online-icon"></div>
                                                        <span>Online</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <NetworkIcon width={13} height={13} />
                                                        <span>{formatLastSeenTimestamp(member.lastSeen)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {isAdminOrCreator() && member.role !== 'creator' && member.nickname !== authUser.nickname && (
                                            <div className="member-action d-flex align-items-center justify-content-center flex-row">
                                                <Dropdown bsPrefix='custom-primary-dropdown' autoClose>
                                                    <Dropdown.Toggle variant='none'>
                                                        <SlArrowDown width={22} />
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu align={'end'}>
                                                        {isOwner() && (
                                                            <>
                                                                {member.role === 'admin' ? (
                                                                    <Dropdown.Item onClick={() => handleChangeMemberRole(member.nickname, 'member')}>
                                                                        <Grade className='grade-icon downgrade' />
                                                                        <span>Appoint as member</span>
                                                                    </Dropdown.Item>
                                                                ) : (
                                                                    <Dropdown.Item onClick={() => handleChangeMemberRole(member.nickname, 'admin')}>
                                                                        <Grade className='grade-icon' />
                                                                        <span>Appoint as administrator</span>
                                                                    </Dropdown.Item>
                                                                )}
                                                            </>
                                                        )}
                                                        <Dropdown.Item onClick={() => handleRemoveMember(member.nickname)}>
                                                            <RxCross1
                                                                className='cross-icon'
                                                                width={12}
                                                            />
                                                            <span>Remove from chat</span>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Stack>
                    <Row className='leave-chat-footer d-flex justify-content-center align-items-center'>
                        <Button variant='danger' className='w-100 h-100 px-4 border-0' onClick={handleOpenLeaveModal}>Leave chat</Button>
                    </Row>
                </>
            ) : (
                <>
                    <AddFriends selectedFriends={selectedFriends} setSelectedFriends={setSelectedFriends} chat={chat} />

                    <Row className='add-members-footer d-flex justify-content-end align-items-center px-4'>
                        <Button variant='light' className='w-auto' onClick={() => setAddMemberVisibility(false)}>Cancel</Button>

                        {selectedFriends.length === 1 ? (
                            <Button variant='primary' className='w-auto ms-3' onClick={handleAddMembers}>Add member</Button>
                        ) : null}
                        {selectedFriends.length > 1 ? (
                            <Button variant='primary' className='w-auto ms-3' onClick={handleAddMembers}>Add members</Button>
                        ) : null}
                    </Row>
                </>
            )}
        </Container>
    )
}

export default GroupChatMenu