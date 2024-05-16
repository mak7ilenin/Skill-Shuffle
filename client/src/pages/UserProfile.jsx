import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileHeader from '../components/ProfileHeader';
import Post from '../components/Post';
import ProfileInfo from '../components/ProfileInfo';
import { API_SERVER } from '../config';

function UserProfile() {
    const { authUser } = useAuth();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Close header
        document.querySelector('.header').classList.remove('closed');

        // Get nickname from url params ?nn=nickname
        const nickname = new URLSearchParams(window.location.search).get('nn');
        if (nickname) {
            if (authUser.nickname === nickname) {
                // Redirect to profile page
                navigate('/me');
                return;
            }

            // Get user information
            axios.get(`${API_SERVER}/users/${nickname}`, { withCredentials: true })
                .then((response) => {
                    setUser(response.data);
                })
                .catch(() => {
                    // Redirect to profile page
                    navigate('/me');
                });
        }

    }, [navigate, authUser.nickname]);

    return (
        <div className='wrapper-profile pb-5'>
            {user && (
                <>
                    <Row
                        className='profile-banner w-100 justify-content-end align-items-end'
                        style={
                            // Check if user has bannerUrl, if not, then take bannerColor
                            user.bannerUrl ? { backgroundImage: `url(${user.bannerUrl})` } : { backgroundColor: user.bannerColor }
                        }
                    />

                    <Row className='profile-header native w-100'>
                        <ProfileHeader />
                    </Row>

                    <Container className='d-flex mx-auto my-0 profile-content'>
                        <Row className='left-mid-block m-0 p-0'>

                            <ProfileInfo user={user} setUser={setUser} />

                            <Row className='profile-header w-100'>
                                <ProfileHeader />
                            </Row>

                            <Col className="main-block-profile tab-content">
                                {/* {user.posts && user.posts.map(post => {
                                    return <Post post={post} />
                                })} */}
                                <Post post={{ id: 1 }} />
                            </Col>
                        </Row>

                        <ProfileAside user={user} />

                    </Container>
                </>
            )}
        </div>
    );
}

export default UserProfile;