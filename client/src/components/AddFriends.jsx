import React, { useState, useEffect, useCallback } from 'react';
import { Button, Image, Stack, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from './AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as Cross } from '../assets/icons/cross-icon.svg';

function AddFriends({ selectedFriends, setSelectedFriends, chat }) {
    const { authUser } = useAuth();
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!chat) {
            axios.get(`${API_SERVER}/users/${authUser.nickname}/friends`, { withCredentials: true })
                .then(response => {
                    setFriends(response.data);
                    setFilteredFriends(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.get(`${API_SERVER}/chats/${chat.id}/friends`, { withCredentials: true })
                .then(response => {
                    setFriends(response.data);
                    setFilteredFriends(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [authUser, setFriends, chat]);

    const handleFriendSearch = () => {
        if (search === '') {
            setFilteredFriends(friends);
            return;
        }
        setFilteredFriends(friends.filter(friend => {
            return friend.firstName.toLowerCase().includes(search.toLowerCase())
                || friend.lastName.toLowerCase().includes(search.toLowerCase())
        }));
    };

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

    return (
        <>
            <Row className='search-friend d-flex justify-content-start align-items-center position-relative ps-3'>
                <input
                    type='text'
                    placeholder='Enter friend’s name or surname'
                    className='border-0'
                    autoFocus={true}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyUp={handleFriendSearch}
                />
                {search !== '' ? (
                    <Button
                        variant='none'
                        className='icon-btn cross-btn px-3'
                        onClick={() => {
                            setSearch('');
                            setFilteredFriends(friends);
                        }}
                    >
                        <Cross className='cross-icon' width={10} height={10} />
                    </Button>
                ) : null}
            </Row>
            <Stack className='friend-list flex-grow-1' direction='vertical' gap={0}>
                {filteredFriends.map((friend, index) => (
                    <Button
                        key={index}
                        variant='light'
                        title='friend'
                        className="friend-container d-flex w-100 border-0 py-2 px-4 flex-row"
                        onClick={(e) => handleSelectFriend(e, friend)}
                    >
                        <Col className="friend-info d-flex justify-content-start align-items-center">
                            <Image
                                src={friend.avatarUrl || imagePlaceholder}
                                alt={'Friend'}
                                width='35'
                                height='35'
                                style={{ objectFit: 'cover' }}
                                roundedCircle
                            />
                            <span className='friend-name ms-3'>{friend.firstName} {friend.lastName}</span>
                        </Col>
                        <Col md='auto' className="friend-add d-flex justify-content-end align-items-center">
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
                        </Col>
                    </Button>
                ))}
            </Stack>
        </>
    )
}

export default AddFriends