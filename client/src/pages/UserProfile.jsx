import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileHeader from '../components/ProfileHeader';
import Post from '../components/Post';
import ProfileInfo from '../components/ProfileInfo';
import { IoNewspaperOutline } from "react-icons/io5";
import { API_SERVER } from '../config';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function UserProfile() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [showAside, setShowAside] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentTab, setCurrentTab] = useState('posts');
    const { authUser } = useAuth();
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
                    setPosts(response.data.posts);
                })
                .catch(() => {
                    // Redirect to profile page
                    navigate('/me');
                });
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

                    {windowDimensions.width > 1000 && (
                        <Row className='profile-header native w-100'>
                            <ProfileHeader
                                type={'USER_PROFILE'}
                                user={user}
                                setPosts={setPosts}
                                tab={currentTab}
                                setTab={setCurrentTab}
                            />
                        </Row>
                    )}

                    <Container className='d-flex mx-auto mt-3 profile-content'>

                        <ProfileInfo user={user} setUser={setUser} showAside={showAside} compacted={false} />

                        {windowDimensions.width <= 1000 && (
                            <Row className='profile-header w-100'>
                                <ProfileHeader
                                    type={'USER_PROFILE'}
                                    user={user}
                                    setPosts={setPosts}
                                    tab={currentTab}
                                    setTab={setCurrentTab}
                                />
                            </Row>
                        )}

                        <Col className="main-block-profile tab-content">
                            {posts && posts.length > 0 ? posts.map(post => {
                                return <Post key={post.id} post={post} setPosts={setPosts} />
                            }) : (
                                <Row className="no-posts d-flex justify-content-center align-content-center">
                                    <IoNewspaperOutline size={90} className='no-posts-icon' />
                                    <p className='text-center mt-1'>There are no posts here yet</p>
                                </Row>
                            )}
                        </Col>

                        {!showAside && <ProfileAside user={user} />}

                    </Container>
                </>
            )}
        </div>
    );
}

export default UserProfile;