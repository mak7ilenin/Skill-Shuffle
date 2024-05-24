import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Tab, Image, Stack, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from './AuthContext';
import { API_SERVER } from '../config';
import { formatLastSeenTimestamp } from '../utils/helpers';

import { HiOutlineStatusOnline } from "react-icons/hi";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function FollowersBlock({ profile }) {
    const { authUser } = useAuth();
    const [tab, setTab] = useState('');
    const [pending, setPending] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [userList, setUserList] = useState(null);

    useEffect(() => {
        if (authUser.nickname !== profile.nickname) {
            setTab('followers');
            axios.get(`${API_SERVER}/users/${profile.nickname}/followers`, { withCredentials: true })
                .then((response) => {
                    setFollowers(response.data);
                    setUserList(response.data);
                });
        } else {
            setTab('pending');
            axios.get(`${API_SERVER}/users/friend-requests`, { withCredentials: true })
                .then((response) => {
                    setPending(response.data.pending);
                    setOutgoing(response.data.outgoing);
                    setUserList(response.data.pending);
                });
        }
    }, [authUser.nickname, profile.nickname])

    const handleTabSelect = (tabName) => {
        setTab(tabName);
        if (tabName === 'pending') {
            setUserList(pending);
        } else if (tabName === 'outgoing') {
            setUserList(outgoing);
        } else {
            setUserList(followers);
        }
    };

    const filterUsers = (users, value) => {
        return users.filter(user => {
            return user.firstName.toLowerCase().includes(value) ||
                user.lastName.toLowerCase().includes(value) ||
                user.nickname.toLowerCase().includes(value);
        });
    }

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        if (tab === 'pending') {
            setUserList(filterUsers(pending, searchValue));
        } else if (tab === 'outgoing') {
            setUserList(filterUsers(outgoing, searchValue));
        } else {
            setUserList(filterUsers(followers, searchValue));
        }
    };

    const handleAction = (action, nickname) => {
        const body = {
            nickname,
            action
        }
        axios.post(`${API_SERVER}/users/relationships`, body, { withCredentials: true })
            .then(() => {
                if (action === 'add_friend' || action === 'ignore') {
                    const updatedPending = pending.filter(pendingUser => pendingUser.nickname !== nickname);
                    setPending(updatedPending);
                    setUserList(updatedPending);
                } else {
                    const updatedOutgoing = outgoing.filter(outgoingUser => outgoingUser.nickname !== nickname);
                    setOutgoing(updatedOutgoing);
                    setUserList(updatedOutgoing);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <Row className='interaction-block flex-column p-3'>
            {userList && (
                <>
                    <Row className='interaction-block__header'>
                        <h4 className='mb-3'>
                            {tab === 'followers' ? 'Followers' : 'Friend requests'}
                        </h4>
                    </Row>

                    <Row className='interaction-block__filters'>
                        {authUser.nickname !== profile.nickname ? (
                            <Tabs defaultActiveKey={tab} id='followers-filters' onSelect={(k) => handleTabSelect(k)}>
                                <Tab
                                    eventKey='followers'
                                    title={<>Followers <span>{followers.length}</span></>}
                                />
                            </Tabs>
                        ) : (
                            <Tabs defaultActiveKey={tab} id='requests-filters' onSelect={(k) => handleTabSelect(k)}>
                                <Tab
                                    eventKey='pending'
                                    title={<>Pending <span>{pending.length}</span></>}
                                />
                                <Tab
                                    eventKey='outgoing'
                                    title={<>Outgoing <span>{outgoing.length}</span></>}
                                />
                            </Tabs>
                        )}
                    </Row>

                    <Row className='interaction-block__search mb-2 mt-3'>
                        <Form.Control
                            type='text'
                            placeholder='Search users'
                            onChange={handleSearch}
                            autoComplete='name'
                            autoFocus
                        />
                    </Row>

                    <Stack direction='vertical' className='interaction-block__content p-0'>
                        {userList.length > 0 ? (
                            userList.map(user => {
                                return (
                                    <Row key={user.nickname} className='interaction-block__content-item py-2'>
                                        <Col md='auto' className='interaction-block__avatar p-0'>
                                            <Link
                                                data-online={formatLastSeenTimestamp(user.lastSeen) === 'Online'}
                                                to={`/users?nn=${user.nickname}`}
                                            >
                                                <Image
                                                    src={user.avatarUrl || imagePlaceholder}
                                                    alt='User'
                                                    roundedCircle
                                                />
                                            </Link>
                                        </Col>
                                        <Col className='interaction-block__content-info ms-3'>
                                            <div>
                                                <Link to={`/users?nn=${user.nickname}`}>
                                                    <span className='user-name'>{user.firstName} {user.lastName}</span>
                                                    <strong className='mx-1'>•</strong>
                                                    <span className='user-nickname'>@{user.nickname}</span>
                                                </Link>
                                            </div>
                                            <div className='d-flex align-items-center gap-2'>
                                                {formatLastSeenTimestamp(user.lastSeen) !== 'Online' ? (
                                                    <>
                                                        <HiOutlineStatusOnline size={17} />
                                                        <span>{formatLastSeenTimestamp(user.lastSeen)}</span>
                                                    </>
                                                ) : <span>Online</span>}
                                            </div>
                                        </Col>
                                        {authUser.nickname === profile.nickname && (
                                            <Col className='interaction-block__actions px-0' xs='auto'>
                                                {tab === 'outgoing' ? (
                                                    <Button variant='secondary' onClick={() => handleAction('unfollow', user.nickname)}>
                                                        {user.autoFollow ? 'Unfollow' : 'Cancel request'}
                                                    </Button>
                                                ) : tab === 'pending' && (
                                                    <>
                                                        <Button variant='primary' onClick={() => handleAction('add_friend', user.nickname)}>
                                                            Accept request
                                                        </Button>
                                                        <Button variant='none' onClick={() => handleAction('ignore', user.nickname)}>
                                                            Ignore
                                                        </Button>
                                                    </>
                                                )}
                                            </Col>
                                        )}
                                    </Row>
                                )
                            })
                        ) : (
                            <p className='interaction-block__no-results text-center my-3'>
                                No users found
                            </p>
                        )}
                    </Stack>
                </>
            )
            }
        </Row >
    )
}

export default FollowersBlock;