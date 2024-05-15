import React, { useState, useEffect } from 'react';
import { Col, Row, Image, NavLink } from 'react-bootstrap';

import { useAuth } from '../components/AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ProfileAside({ user }) {
    const { authUser } = useAuth();
    const [friendsOnline, setFriendsOnline] = useState([]);

    useEffect(() => {
        const friendsOnline = user.friends.filter(friend => {
            // lastSeen is a sql.timestamp, need to check if it's not older than 5 minutes from now time
            const lastSeen = new Date(friend.lastSeen).getTime();
            const now = new Date().getTime();
            const fiveMinutes = 5 * 60 * 1000;
            return now - lastSeen < fiveMinutes;
        })

        setFriendsOnline(friendsOnline);
    }, [user]);

    return (
        <Col className="right-block-profile d-flex flex-column">
            {/* <Col className='profile-aside might-like d-flex flex-column justify-content-between p-3'>
                <p className='aside-header'>You might like</p>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <p className='show-more mt-1'>Show more</p>
            </Col> */}

            <Col className='profile-aside friend-list d-flex flex-column justify-content-between p-3'>
                {friendsOnline.length > 0 && (
                    <>
                        <p className='aside-header'>Friends online <span>{friendsOnline.length}</span></p>
                        <Row className='friends-online'>
                            {friendsOnline.map(friend => {
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
                        </Row>

                        <hr className='my-3' />
                    </>
                )}

                {user.friends.length > 0 && (
                    <>
                        <p className='aside-header'>Friends <span>{user.friends.length}</span></p>
                        <Row className='friends'>
                            {user.friends.map(friend => {
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
                        </Row>
                    </>
                )}
            </Col>
        </Col>
    )
}

export default ProfileAside;