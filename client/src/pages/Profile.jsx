import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileHeader from '../components/ProfileHeader';
import Post from '../components/Post';
import ProfileInfo from '../components/ProfileInfo';
import { API_SERVER } from '../config';

import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';

function Profile() {
    const [user, setUser] = useState(null);
    const { authUser } = useAuth();

    useEffect(() => {
        // Close header
        document.querySelector('.header').classList.remove('closed');

        // Get user information
        axios.get(`${API_SERVER}/users/${authUser.nickname}`, { withCredentials: true })
            .then((response) => {
                setUser(response.data);
            });
    }, [authUser.nickname]);

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
                        <Button variant='none' className='profile-btn border-0 p-2 rounded-circle'>
                            <EditBanner />
                        </Button>
                    </Row>

                    <Row className='profile-header native w-100'>
                        <ProfileHeader />
                    </Row>

                    <Container className='d-flex mx-auto my-0 profile-content'>
                        <Row className='left-mid-block m-0 p-0'>

                            <ProfileInfo user={user} />

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

export default Profile;