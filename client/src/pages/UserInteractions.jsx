import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileInfo from '../components/ProfileInfo';
import FriendsBlock from '../components/FriendsBlock';
import { API_SERVER } from '../config';

import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

function UserInteractions() {
    const { authUser } = useAuth();
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [user, setUser] = useState(null);
    const [showAside, setShowAside] = useState(false);
    const [interactionType, setInteractionType] = useState('');

    useEffect(() => {
        // Get nickname from url param
        const nickname = new URLSearchParams(window.location.search).get('nn');
        if (nickname) {
            // Get user information
            axios.get(`${API_SERVER}/users/${nickname}`, { withCredentials: true })
                .then((response) => {
                    setUser(response.data);
                })
        } else {
            // Get authed user information
            axios.get(`${API_SERVER}/users/${authUser.nickname}`, { withCredentials: true })
                .then((response) => {
                    setUser(response.data);
                })
        }
    }, [authUser.nickname]);

    useEffect(() => {
        if (user) {
            const urlPath = window.location.pathname;
            switch (urlPath) {
                case '/friends':
                    setInteractionType('FRIENDS');
                    break;
                case '/followers':
                    setInteractionType('FOLLOWERS');
                    // TODO: Get followers
                    break;
                case '/friend-requests':
                    setInteractionType('FRIEND_REQUESTS');
                    // TODO: Get friend requests
                    break;
                case '/communities':
                    setInteractionType('COMMUNITIES');
                    // TODO: Get communities
                    break;
                case 'photos':
                    setInteractionType('PHOTOS');
                    // TODO: Get photos
                    break;
                case 'blocked':
                    setInteractionType('BLOCKED');
                    // TODO: Get blocked users
                    break;
                default:
                    break;
            }
        }
    }, [user]);

    useEffect(() => {
        // Close header
        document.querySelector('.header').classList.remove('closed');

        handleResize();
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
            if (windowDimensions.width > 1400 || windowDimensions.width <= 1000) {
                setShowAside(false);
            } else {
                setShowAside(true);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions.width]);

    return (
        <div className="wrapper-user-interactions pb-5">
            {user && (
                <>
                    <Row
                        className="profile-banner w-100 justify-content-end align-items-end"
                        style={
                            // Check if user has bannerUrl, if not, then take bannerColor
                            user.bannerUrl ? { backgroundImage: `url(${user.bannerUrl})` } : { backgroundColor: user.bannerColor }
                        }
                    >
                        {authUser.nickname === user.nickname && (
                            <Button variant='none' className='border-0 p-2 rounded-circle'>
                                <EditBanner />
                            </Button>
                        )}
                    </Row>

                    <Container className='d-flex mx-auto mt-3 profile-content'>
                        <ProfileInfo user={user} showAside={showAside} compacted={true} />

                        <Col className="main-block-profile tab-content">
                            {/* TODO: implement interactions block */}
                            {interactionType === 'FRIENDS' && <FriendsBlock friends={user.friends} />}
                        </Col>

                        {!showAside && <ProfileAside user={user} />}

                    </Container>
                </>
            )}
        </div>
    )
}

export default UserInteractions;