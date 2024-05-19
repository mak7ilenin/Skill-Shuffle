import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';

import { IoBanOutline } from "react-icons/io5";
import { IoPersonAddSharp } from "react-icons/io5";

function ProfileRelationshipButton({ user, setUser }) {

    const handleUserRelationshipChange = (nickname, action) => {
        const requestUser = {
            nickname: nickname,
            action: action
        };
        axios.post(`${API_SERVER}/users/relationships`, requestUser, { withCredentials: true })
            .then((res) => {
                setUser(prevUser => {
                    return { ...prevUser, relationship: res.data }
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            {user.relationship === 'friend' ? (
                <Button variant='secondary' onClick={() => handleUserRelationshipChange(user.nickname, 'unfriend')}>
                    Unfriend
                </Button>
            ) : user.relationship === 'follower' ? (
                <Dropdown bsPrefix='custom-primary-dropdown'>
                    <Dropdown.Toggle variant='primary'>
                        Follows you
                    </Dropdown.Toggle>

                    <Dropdown.Menu align={'end'}>
                        <Dropdown.Item as={Button} onClick={() => handleUserRelationshipChange(user.nickname, 'add_friend')}>
                            <IoPersonAddSharp size={18} />
                            <span>Add friend</span>
                        </Dropdown.Item>
                        <Dropdown.Item as={Button} onClick={() => handleUserRelationshipChange(user.nickname, 'remove_follower')}>
                            <IoBanOutline size={18} />
                            <span>Remove from followers</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ) : user.relationship === 'following' ? (
                <Dropdown bsPrefix='custom-primary-dropdown'>
                    <Dropdown.Toggle variant='secondary'>
                        Request sent
                    </Dropdown.Toggle>

                    <Dropdown.Menu align={'end'}>
                        <Dropdown.Item as={Button} onClick={() => handleUserRelationshipChange(user.nickname, 'unfollow')}>
                            <IoBanOutline size={18} />
                            <span>Cancel request</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ) : user.relationship === 'none' && user.autoFollow ? (
                <Button variant='primary' onClick={() => handleUserRelationshipChange(user.nickname, 'follow')}>
                    Follow
                </Button>
            ) : (
                <Button variant='primary' onClick={() => handleUserRelationshipChange(user.nickname, 'add_friend')}>
                    Add friend
                </Button>
            )}
        </>
    )
}

export default ProfileRelationshipButton;