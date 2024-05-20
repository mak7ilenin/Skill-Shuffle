import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { API_SERVER } from '../config';

function ProfileHeader({ type, user, setPosts }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'posts');

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
                axios.get(`${API_SERVER}/posts/bookmarked?nickname=${user.nickname}`, { withCredentials: true })
                    .then((response) => {
                        setPosts(response.data);
                    });
                break;
            default:
                break;
        }
    }, [tab, user.nickname, setPosts]);

    const handleTabChange = (tabName) => {
        const url = new URL(window.location.href);
        tabName === 'posts' ? url.searchParams.delete('tab') : url.searchParams.set('tab', tabName);
        navigate(url.toString().replace(url.origin + url.pathname, ''));
        setTab(tabName);
    }

    return (
        <Tabs
            id='profileHeaderList'
            defaultActiveKey={tab}
            className="d-flex border-0 flex-row align-items-center justify-content-center h-100"
            onSelect={(k) => handleTabChange(k)}
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
            {type === 'MY_PROFILE' && (
                <Tab
                    eventKey='bookmarks'
                    title={
                        <>
                            <p className='tab-name'>Bookmarks</p>
                            <p className='tab-counter'>{user.bookmarkedPostsCount}</p>
                        </>
                    }
                />
            )}
        </Tabs>
    )
}

export default ProfileHeader;