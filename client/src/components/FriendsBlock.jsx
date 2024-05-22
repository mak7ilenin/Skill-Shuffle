import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Tabs, Tab, Image, Stack, Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';

import { formatLastSeenTimestamp } from '../utils/helpers';
import { API_SERVER } from '../config';
import { AESEncrypt } from '../crypto';
import { useAuth } from './AuthContext';

import { IoIosMore } from "react-icons/io";
import { HiOutlineStatusOnline } from "react-icons/hi";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function FriendsBlock({ friends }) {
    const { authUser } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('all');
    const [friendList, setFriendList] = useState(friends);

    const filterFriendsOnline = friends.filter(friend => {
        const lastSeen = new Date(friend.lastSeen).getTime();
        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;
        return now - lastSeen < fiveMinutes;
    });

    const handleTabSelect = (tabName) => {
        setTab(tabName);
        if (tabName === 'online') {
            setFriendList(filterFriendsOnline);
        } else {
            setFriendList(friends);
        }
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredFriends = friends.filter(friend => {
            return friend.firstName.toLowerCase().includes(searchValue) ||
                friend.lastName.toLowerCase().includes(searchValue) ||
                friend.nickname.toLowerCase().includes(searchValue);
        });
        setFriendList(filteredFriends);
    };

    const openChat = (user) => {
        axios.post(`${API_SERVER}/chats/open/${user.nickname}`, {}, { withCredentials: true })
            .then(response => {
                navigate(`/messenger?c=${AESEncrypt(response.data)}`);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Row className='interaction-block flex-column p-3'>

            <Row className='interaction-block__header'>
                <h4 className='mb-3'>Friends</h4>
            </Row>

            <Row className='interaction-block__filters'>
                <Tabs defaultActiveKey={tab} onSelect={(k) => handleTabSelect(k)}>
                    <Tab
                        eventKey='all'
                        title={<>All friends <span>{friends.length}</span></>}
                    />
                    <Tab
                        eventKey='online'
                        title={<>Friends online <span>{filterFriendsOnline.length}</span></>}
                    />
                </Tabs>
            </Row>

            <Row className='interaction-block__search mb-2 mt-3'>
                <Form.Control
                    type='text'
                    placeholder='Search friends'
                    onChange={handleSearch}
                    autoComplete='name'
                    autoFocus
                />
            </Row>

            <Stack direction='vertical' className='interaction-block__content p-0'>
                {friendList && friendList.length > 0 ? (
                    friendList.map(friend => {
                        return (
                            <Row key={friend.nickname} className='interaction-block__content-item py-2'>
                                <Col md='auto' className='interaction-block__avatar p-0'>
                                    <Link
                                        data-online={`${formatLastSeenTimestamp(friend.lastSeen) === 'Online'}`}
                                        to={`/users?nn=${friend.nickname}`}
                                    >
                                        <Image
                                            src={friend.avatarUrl || imagePlaceholder}
                                            alt='User'
                                            roundedCircle
                                        />
                                    </Link>
                                </Col>
                                <Col className='interaction-block__content-info ms-3'>
                                    <div>
                                        <Link to={`/users?nn=${friend.nickname}`}>
                                            <span className='user-name'>{friend.firstName} {friend.lastName}</span>
                                            <strong className='mx-1'>•</strong>
                                            <span className='user-nickname'>@{friend.nickname}</span>
                                        </Link>
                                    </div>
                                    <div className='d-flex align-items-center gap-2'>
                                        {formatLastSeenTimestamp(friend.lastSeen) !== 'Online' ? (
                                            <>
                                                <HiOutlineStatusOnline size={17} />
                                                <span>{formatLastSeenTimestamp(friend.lastSeen)}</span>
                                            </>
                                        ) : <span>Online</span>}
                                    </div>
                                    {friend.nickname !== authUser.nickname && (
                                        <div>
                                            <p role='button' onClick={() => openChat(friend)}>Write message</p>
                                        </div>
                                    )}
                                </Col>
                                <Col className='h-100 px-0 align-content-center' xs='auto'>
                                    <Dropdown bsPrefix='custom-primary-dropdown'>
                                        <Dropdown.Toggle variant='none' className='border-0'>
                                            <IoIosMore size={20} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href={`/friends?nn=${friend.nickname}`}>Show friends</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        )
                    })
                ) : (
                    <p className='interaction-block__no-results text-center my-3'>
                        No friends found
                    </p>
                )}
            </Stack>

        </Row>
    )
}

export default FriendsBlock;