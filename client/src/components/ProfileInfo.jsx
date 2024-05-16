import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

import { useAuth } from './AuthContext';
import ProfileRelationshipButton from './ProfileRelationshipButton';

import { ReactComponent as Trophy } from '../assets/icons/pointsTrophy.svg';
import { ReactComponent as BornIn } from '../assets/icons/bornIn.svg';
import { ReactComponent as Friends } from '../assets/icons/friendsIcon.svg';
import { ReactComponent as Subscriptions } from '../assets/icons/subscriptionsIcon.svg';
import { ReactComponent as Photos } from '../assets/icons/photosIcon.svg';
import { ReactComponent as Favorite } from '../assets/icons/favorite.svg';
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg';
import { HiOutlineStatusOnline } from "react-icons/hi";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ProfileInfo({ user, setUser }) {
    const { authUser } = useAuth();

    const formatJoinTimestamp = () => {
        const date = new Date(user.joinedAt);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatBirthdayTimestamp = () => {
        const date = new Date(user.birthDate);
        return date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    };

    const formatLastSeenTimestamp = () => {
        const date = new Date(user.lastSeen);
        const currentDate = new Date();
        const difference = currentDate - date;

        if (difference > 31536000000) {
            // dd/mmm/yyyy if the message was sent more than a year ago
            return `Last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else if (difference > 86400000) {
            // dd/mmm if the message was sent less than a year ago but more than a day ago
            return `Last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
        } else if (difference > 3600000) {
            // hh:mm if the message was sent less than a day ago and more than an hour ago
            return `Last seen at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (difference > 300000) {
            // mm ago if message was sent more than 5 minutes
            return `Last seen ${Math.floor(difference / 60000)} minutes ago`;
        } else {
            // If the message was sent less than 5 minutes ago then return 'Online'
            return 'Online';
        }
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

                <Row className="profile-statistics flex-column">
                    <Col className='d-flex flex-row align-items-center mb-2'>
                        {formatLastSeenTimestamp() === 'Online' ? (
                            <>
                                <div className="online-icon me-2"></div>
                                <p>Online</p>
                            </>
                        ) : (
                            <>
                                <HiOutlineStatusOnline size={18} className='me-2' />
                                <p>{formatLastSeenTimestamp()}</p>
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

                <Row className='profile-bio flex-column'>
                    {user.bio && <p className='p-0'>{user.bio}</p>}
                    {authUser.nickname === user.nickname ? (
                        <Button variant='secondary'>Edit profile</Button>
                    ) : (
                        <ProfileRelationshipButton user={user} setUser={setUser} />
                    )}
                </Row>
            </div>


            <div className="second-col">
                <Row className='profile-links flex-column mt-2'>
                    <Col className='d-flex flex-row mb-1 align-items-center'>
                        <Friends className='me-2' />
                        <p>
                            <span>{user.friends.length}</span> • <a href="/">friends</a>
                        </p>
                    </Col>
                    <Col className='d-flex flex-row my-1 align-items-center'>
                        <Favorite className='me-2' />
                        <p>
                            <span>{user.followersCount}</span> • <a href="/">followers</a>
                        </p>
                    </Col>
                    {/* <Col className='d-flex flex-row my-1 align-items-center'>
                        <Subscriptions className='me-2' />
                        <p>
                            <span>34</span> • <a href="/">subscriptions</a>
                        </p>
                    </Col>
                    <Col className='d-flex flex-row mt-1 align-items-center'>
                        <Photos className='me-2' />
                        <p>
                            <span>7</span> • <a href="/">photos and videos</a>
                        </p>
                    </Col> */}
                </Row>

                {/* <Row className='mt-3 profile-media'>
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
                    </Col>
                    <Col>
                        <Image src={user.avatarUrl || imagePlaceholder} alt='Media' />
                    </Col>
                </Row> */}
            </div>
        </Col>
    )
}

export default ProfileInfo