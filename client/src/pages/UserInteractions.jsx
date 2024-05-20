import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileInfo from '../components/ProfileInfo';
import { API_SERVER } from '../config';

import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

function UserInteractions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [user, setUser] = useState(null);
    const [showAside, setShowAside] = useState(false);
    const { authUser } = useAuth();
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Get nickname from url param
        const nickname = new URLSearchParams(window.location.search).get('nn');
        if (nickname) {
            // Get user information
            axios.get(`${API_SERVER}/users/${nickname}`, { withCredentials: true })
                .then((response) => {
                    setUser(response.data);
                })
        }
    }, []);

    useEffect(() => {
        // Close header
        document.querySelector('.header').classList.remove('closed');

        // If url path is /friends, /requests, get needed data from server
        const urlPath = window.location.pathname;
        switch (urlPath) {
            case '/friends':
                // Get user friends
                break;
        
            default:
                break;
        }

    }, [navigate, authUser.nickname]);

    useEffect(() => {
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
                        <Button variant='none' className='profile-btn border-0 p-2 rounded-circle'>
                            <EditBanner />
                        </Button>
                    </Row>

                    <Container className='d-flex mx-auto my-0 profile-content'>
                        <ProfileInfo user={user} showAside={showAside} compacted={true} />

                        <Col className="main-block-profile tab-content">
                            {/* TODO: implement interactions block */}
                        </Col>

                        {!showAside && <ProfileAside user={user} />}

                    </Container>
                </>
            )}
        </div>
    )
}

export default UserInteractions;