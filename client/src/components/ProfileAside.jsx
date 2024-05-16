import React, { useState, useEffect } from 'react';
import { Col, Row, Image, NavLink, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import RelationshipButton from './RelationshipButton';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ProfileAside({ user }) {
    const navigate = useNavigate();
    const [friendsOnline, setFriendsOnline] = useState([]);
    const [mightKnowUsers, setMightKnowUsers] = useState([]);

    useEffect(() => {
        const friendsOnline = user.friends.filter(friend => {
            // lastSeen is a sql.timestamp, need to check if it's not older than 5 minutes from now time
            const lastSeen = new Date(friend.lastSeen).getTime();
            const now = new Date().getTime();
            const fiveMinutes = 5 * 60 * 1000;
            return now - lastSeen < fiveMinutes;
        })

        setMightKnowUsers(user.mightKnow);
        setFriendsOnline(friendsOnline);
    }, [user]);

    return (
        <>
            {user.mightKnow || user.mutualFriends ? (
                <Col className="right-block-profile d-flex flex-column">
                    {mightKnowUsers && mightKnowUsers.length > 0 ? (
                        // MIGHT KNOW
                        <Col className='profile-aside might-know d-flex flex-column justify-content-between p-3'>
                            <h3 className='aside-header'>You may know</h3>
                            <Stack direction='vertical' gap={2}>
                                {mightKnowUsers.map(mightKnownUser => {
                                    return (
                                        <Row key={mightKnownUser.nickname} className='user-container d-flex align-items-center justify-content-between'>
                                            <Col className='user-img p-0 me-2'>
                                                <Image
                                                    src={mightKnownUser.avatarUrl || imagePlaceholder}
                                                    alt='User'
                                                    roundedCircle
                                                />
                                            </Col>
                                            <Col className='user-info'>
                                                <p className='name' onClick={() => navigate(`/users?nn=${mightKnownUser.nickname}`)}>
                                                    {mightKnownUser.firstName} {mightKnownUser.lastName}
                                                </p>
                                                <p className='nickname'>@{mightKnownUser.nickname}</p>
                                            </Col>
                                            <Col className='btn-container'>
                                                {/* <Button variant="secondary">Add friend</Button> */}
                                                <RelationshipButton
                                                    user={mightKnownUser}
                                                    results={mightKnowUsers}
                                                    setResults={setMightKnowUsers}
                                                />
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Stack>
                            {mightKnowUsers.length > 3 && (
                                <p className='show-more mt-1'>Show more</p>
                            )}
                        </Col>
                    ) : user.mutualFriends && user.mutualFriends.length > 0 && (
                        // MUTUAL FRIENDS
                        <Row className='profile-aside mutual-friends p-3'>
                            <h3 className='aside-header'>Mutual friends <span>{user.mutualFriends.length}</span></h3>
                            <Col className='friends-preview d-flex align-items-center'>
                                {user.mutualFriends.slice(0, 3).map(friend => {
                                    return (
                                        <Image
                                            key={friend.nickname}
                                            src={friend.avatarUrl || imagePlaceholder}
                                            alt='Friend'
                                            roundedCircle
                                        />
                                    )
                                })}
                                {user.mutualFriends.length > 3 && (
                                    <div className='more-friends d-flex align-items-center justify-content-center'>
                                        <span>+{user.mutualFriends.length - 3}</span>
                                    </div>
                                )}
                            </Col>

                            <Col className='friends-info ms-2'>
                                <p className='friend-name'>
                                    {user.mutualFriends.slice(0, 3).map((friend, i) => {
                                        return (
                                            <span key={friend.nickname}>
                                                {friend.firstName}
                                                {i === 1 && (i + 1) !== user.mutualFriends.length ? ' and '
                                                    : i === 2 && (i + 1) !== user.mutualFriends.length ? ` and ${user.mutualFriends.length - 3} more friends`
                                                        : (i + 1) !== user.mutualFriends.length ? ', '
                                                            : ''}
                                            </span>
                                        )
                                    })}
                                </p>
                            </Col>
                        </Row>
                    )}

                    {user.friends.length > 0 && (
                        <Col className='profile-aside friend-list d-flex flex-column justify-content-between p-3'>
                            {/* FRIENDS ONLINE */}
                            {friendsOnline.length > 0 && (
                                <>
                                    <h3 className='aside-header'>Friends online <span>{friendsOnline.length}</span></h3>
                                    <Stack direction='horizontal' className='friends-online'>
                                        {friendsOnline.slice(0, 4).map(friend => {
                                            return (
                                                <NavLink
                                                    key={friend.nickname}
                                                    href={`/users?nn=${friend.nickname}`}
                                                    className='friend-container online'
                                                >
                                                    <Row className='friend-img'>
                                                        <Image
                                                            src={friend.avatarUrl || imagePlaceholder}
                                                            alt='Friend'
                                                            roundedCircle
                                                        />
                                                    </Row>
                                                    <p>{friend.firstName}</p>
                                                </NavLink>
                                            )
                                        })}
                                    </Stack>

                                    <hr className='my-3' />
                                </>
                            )}

                            {/* FRIEND LIST */}
                            {user.friends.length > 0 && (
                                <>
                                    <p className='aside-header'>Friends <span>{user.friends.length}</span></p>
                                    <Stack direction='horizontal' className='friends'>
                                        {user.friends.slice(0, 8).map(friend => {
                                            return (
                                                <NavLink
                                                    key={friend.nickname}
                                                    href={`/users?nn=${friend.nickname}`}
                                                    className='friend-container'
                                                >
                                                    <Row className='friend-img'>
                                                        <Image
                                                            src={friend.avatarUrl || imagePlaceholder}
                                                            alt='Friend'
                                                            roundedCircle
                                                        />
                                                    </Row>
                                                    <p>{friend.firstName}</p>
                                                </NavLink>
                                            )
                                        })}
                                    </Stack>
                                </>
                            )}
                        </Col>
                    )}
                </Col>
            ) : null}
        </>
    )
}

export default ProfileAside;