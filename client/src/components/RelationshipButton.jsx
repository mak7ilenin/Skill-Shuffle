import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';

import { RiHeartAddLine } from "react-icons/ri";
import { FaHeartBroken } from "react-icons/fa";
import { BsFillPersonDashFill } from "react-icons/bs";
import { BsPersonAdd } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa6";

function RelationshipButton({ user, results, setResults }) {
    const handleUserRelationshipChange = (nickname, action) => {
        const user = {
            nickname: nickname,
            action: action
        };
        axios.post(`${API_SERVER}/users/relationships`, user, { withCredentials: true })
            .then((res) => {
                setResults(results.map(person => {
                    if (person.nickname === nickname) {
                        return res.data;
                    }
                    return person;
                }));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            {/*
            * Add the following icons to the right side of the user's name:
            * - RiHeartAddLine (Follow)
            * - FaHeartBroken (Unfollow)
            * - BsFillPersonDashFill (Unfriend)
            * - BsPersonAdd (Add friend)
            * - FaUserCheck (Accept)
            */}
            {user.relationship === 'friend' ? (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-unfriend">Unfriend</Tooltip>}
                >
                    <Button variant='none' onClick={() => handleUserRelationshipChange(user.nickname, 'unfriend')}>
                        <BsFillPersonDashFill size={20} />
                    </Button>
                </OverlayTrigger>
            ) : user.relationship === 'follower' ? (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-accept">Accept friend request</Tooltip>}
                >
                    <Button variant='none' onClick={() => handleUserRelationshipChange(user.nickname, 'add_friend')}>
                        <FaUserCheck size={20} />
                    </Button>
                </OverlayTrigger>
            ) : user.relationship === 'following' ? (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-unfollow">Cancel friend request</Tooltip>}
                >
                    <Button variant='none' onClick={() => handleUserRelationshipChange(user.nickname, 'unfollow')}>
                        <FaHeartBroken size={18} />
                    </Button>
                </OverlayTrigger>
            ) : user.relationship === 'none' && user.autoFollow ? (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-follow">Follow</Tooltip>}
                >
                    <Button variant='none' onClick={() => handleUserRelationshipChange(user.nickname, 'follow')}>
                        <RiHeartAddLine size={20} />
                    </Button>
                </OverlayTrigger>
            ) : (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-add">Add friend</Tooltip>}
                >
                    <Button variant='none' onClick={() => handleUserRelationshipChange(user.nickname, 'add_friend')}>
                        <BsPersonAdd size={20} />
                    </Button>
                </OverlayTrigger>
            )}
        </>
    )
}

export default RelationshipButton