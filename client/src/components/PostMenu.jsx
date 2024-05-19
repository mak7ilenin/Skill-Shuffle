import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from './AuthContext';

import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { ReactComponent as MenuIcon } from '../assets/icons/post-menu.svg';

function PostMenu({ post, setPosts }) {
    const { authUser } = useAuth();
    const [bookmarked, setBookmarked] = useState(post.bookmarked);

    const handlePostBookmark = () => {
        axios.post(`${API_SERVER}/posts/${post.id}/bookmark`, {}, { withCredentials: true })
            .then(() => {
                setPosts(prevPosts => prevPosts.map(prevPost => {
                    if (prevPost.id === post.id) {
                        return {
                            ...prevPost,
                            bookmarked: !bookmarked
                        };
                    }
                    return prevPost;
                }));
                setBookmarked(!bookmarked);
            });
    };

    return (
        <Dropdown bsPrefix='custom-primary-dropdown' autoClose>
            <Dropdown.Toggle variant='link' title='Menu'>
                <MenuIcon width={19} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handlePostBookmark}>
                    {bookmarked ? (
                        <>
                            <IoBookmark size={24} /> Remove from bookmarks
                        </>
                    ) : (
                        <>
                            <IoBookmarkOutline size={24} /> Add to bookmarks
                        </>
                    )}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default PostMenu