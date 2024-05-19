import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from './AuthContext';
import { API_SERVER } from '../config';

function ProfileHeader({ type, user, setPosts }) {
    const [tab, setTab] = useState('posts');

    useEffect(() => {
        switch (tab) {
            case 'posts':
                axios.get(`${API_SERVER}/posts?nickname=${user.nickname}`, { withCredentials: true })
                    .then((response) => {
                        setPosts(response.data);
                    });
                break;
            case 'likes':
                axios.get(`${API_SERVER}/posts/liked?nickname=${user.nickname}`, { withCredentials: true })
                    .then((response) => {
                        setPosts(response.data);
                    });
                break;
            case 'bookmarks':
                // Get bookmarks
                break;
            default:
                break;
        }
    }, [tab, user.nickname, setPosts]);

    return (
        <Tabs
            id='profileHeaderList'
            defaultActiveKey='posts'
            className="d-flex border-0 flex-row align-items-center justify-content-center h-100"
            onSelect={(k) => setTab(k)}
        >
            <Tab
                eventKey='posts'
                title={
                    <>
                        <p className='tab-name'>Posts</p>
                        <p className='tab-counter'>{user.postsCount}</p>
                    </>
                }
            />
            <Tab
                eventKey='likes'
                title={
                    <>
                        <p className='tab-name'>Likes</p>
                        <p className='tab-counter'>{user.likedPostsCount}</p>
                    </>
                }
            />
            {/* {type === 'MY_PROFILE' && (
                <Tab
                    eventKey='bookmarks'
                    title={
                        <>
                            <p className='tab-name'>Bookmarks</p>
                            <p className='tab-counter'>13</p>
                        </>
                    }
                />
            )} */}
        </Tabs>
    )
}

export default ProfileHeader;