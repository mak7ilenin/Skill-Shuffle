import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

import { useAuth } from './AuthContext';
import ProfileRelationshipButton from './ProfileRelationshipButton';
import ProfileAside from './ProfileAside';
import { formatLastSeenTimestamp } from '../utils/helpers';

import { ReactComponent as Trophy } from '../assets/icons/pointsTrophy.svg';
import { ReactComponent as BornIn } from '../assets/icons/bornIn.svg';
import { ReactComponent as Friends } from '../assets/icons/friendsIcon.svg';
// import { ReactComponent as Subscriptions } from '../assets/icons/subscriptionsIcon.svg';
// import { ReactComponent as Photos } from '../assets/icons/photosIcon.svg';
import { ReactComponent as Favorite } from '../assets/icons/favorite.svg';
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg';
import { HiOutlineStatusOnline } from "react-icons/hi";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ProfileInfo({ user, setUser, showAside, compacted }) {
    const { authUser } = useAuth();

    const formatJoinTimestamp = () => {
        const date = new Date(user.joinedAt);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatBirthdayTimestamp = () => {
        const date = new Date(user.birthDate);
        return date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    };

    return (
        <Col className='profile-info-block d-flex justify-content-start flex-column'>
            <div className="first-col">
                <Row className='profile-avatar'>
                    <Image
                        src={user.avatarUrl || imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Row>

                <Row className='profile-info mb-3'>
                    <p className='user-name mt-2'>{user.firstName} {user.lastName}</p>
                    <Col className='d-flex flex-row align-items-center'>
                        <p className='nickname'>@{user.nickname}</p>
                        <Trophy width={18} height={18} className='mx-2' />
                        <p className='points'>{user.points} points</p>
                    </Col>
                </Row>

                {!compacted && (
                    <>
                        <Row className="profile-statistics flex-column">
                            <Col className='d-flex flex-row align-items-center mb-2'>
                                {formatLastSeenTimestamp(user.lastSeen) === 'Online' || authUser.nickname === user.nickname ? (
                                    <>
                                        <div className="online-icon me-2"></div>
                                        <p>Online</p>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineStatusOnline size={18} className='me-2' />
                                        <p>{formatLastSeenTimestamp(user.lastSeen)}</p>
                                    </>
                                )}
                            </Col>
                            <Col className='d-flex flex-row align-items-center mb-2'>
                                <Calendar className='me-2' />
                                <p>Joined in {formatJoinTimestamp()}</p>
                            </Col>
                            <Col className='d-flex flex-row align-items-center mb-2'>
                                <BornIn className='me-2' />
                                <p>Born in {formatBirthdayTimestamp()}</p>
                            </Col>
                        </Row>

                        <hr className='my-1' />

                        <Row className='profile-bio flex-column mb-2'>
                            {user.bio && <p className='p-0'>{user.bio}</p>}
                            {/* {authUser.nickname === user.nickname ? (
                                <Button variant='secondary'>Edit profile</Button>
                            ) : (
                                <ProfileRelationshipButton user={user} setUser={setUser} />
                            )} */}
                            {authUser.nickname !== user.nickname && (
                                <ProfileRelationshipButton user={user} setUser={setUser} />
                            )}
                        </Row>
                    </>
                )}
            </div>

            <div className="second-col">
                <Row className='profile-links flex-column'>
                    <Col className='d-flex flex-row mb-1 align-items-center'>
                        <Friends className='me-2' />
                        <p>
                            <span>{user.friends.length}</span> • <a href={`/friends?nn=${user.nickname}`}>friends</a>
                        </p>
                    </Col>
                    <Col className='d-flex flex-row my-1 align-items-center'>
                        <Favorite className='me-2' />
                        <p>
                            <span>{user.followersCount}</span> • <a href={`/followers?nn=${user.nickname}`}>followers</a>
                        </p>
                    </Col>
                    {/* <Col className='d-flex flex-row my-1 align-items-center'>
                        <Subscriptions className='me-2' />
                        <p>
                            <span>34</span> • <a href="/">subscriptions</a>
                        </p>
                    </Col> */}
                    {/* <Col className='d-flex flex-row mt-1 align-items-center'>
                        <Photos className='me-2' />
                        <p>
                            <span>7</span> • <a href="/">photos and videos</a>
                        </p>
                    </Col> */}
                </Row>

                {!compacted && (
                    <Row className='mt-3 profile-media'>
                        {/* <Col>
                            <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                        </Col>
                        <Col>
                            <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                        </Col>
                        <Col>
                            <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                        </Col>
                        <Col>
                            <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                        </Col>
                        <Col>
                            <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                        </Col>
                        <Col>
                            <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                        </Col> */}
                    </Row>
                )}
            </div>

            {showAside && <ProfileAside user={user} />}

        </Col>
    )
}

export default ProfileInfo