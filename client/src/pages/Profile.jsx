import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileHeader from '../components/ProfileHeader';
import Post from '../components/Post';
import ProfileInfo from '../components/ProfileInfo';
import PostEditor from '../components/PostEditor';
import { API_SERVER } from '../config';

import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

function Profile() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [showAside, setShowAside] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('');
    const { authUser } = useAuth();

    useEffect(() => {
        document.body.removeAttribute('style');
        document.querySelector('.header').classList.remove('closed');

        const tabParam = new URLSearchParams(window.location.search).get('tab') || 'posts';
        setTab(tabParam);

        // Get user information
        axios.get(`${API_SERVER}/users/${authUser.nickname}`, { withCredentials: true })
            .then((response) => {
                setUser(response.data);
                setPosts(response.data.posts)
            });
    }, [authUser.nickname]);

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
                        className="profile-banner w-100 justify-content-end align-items-end"
                        style={
                            // Check if user has bannerUrl, if not, then take bannerColor
                            user.bannerUrl ? { backgroundImage: `url(${user.bannerUrl})` } : { backgroundColor: user.bannerColor }
                        }
                    >
                        {/* <Button variant='none' className='border-0 p-2 rounded-circle'>
                            <EditBanner />
                        </Button> */}
                    </Row>

                    {windowDimensions.width > 1000 && (
                        <Row className='profile-header native w-100'>
                            <ProfileHeader
                                type={'MY_PROFILE'}
                                user={user}
                                setPosts={setPosts}
                                tab={tab}
                                setTab={setTab}
                            />
                        </Row>
                    )}

                    <Container className='d-flex mx-auto mt-3 profile-content'>
                        <ProfileInfo user={user} showAside={showAside} compacted={false} />

                        {windowDimensions.width <= 1000 && (
                            <Row className='profile-header w-100'>
                                <ProfileHeader
                                    type={'MY_PROFILE'}
                                    user={user}
                                    setPosts={setPosts}
                                    tab={tab}
                                    setTab={setTab}
                                />
                            </Row>
                        )}

                        <Col className="main-block-profile tab-content">

                            {tab === 'posts' && <PostEditor setPosts={setPosts} setUser={setUser} />}

                            {posts && posts.length > 0 && posts.map(post => {
                                return <Post key={post.id} post={post} setPosts={setPosts} setUser={setUser} />
                            })}
                        </Col>

                        {!showAside && <ProfileAside user={user} />}

                    </Container>
                </>
            )}
        </div>
    );
}

export default Profile;