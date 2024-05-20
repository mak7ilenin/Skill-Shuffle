import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from './AuthContext';

import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { ReactComponent as MenuIcon } from '../assets/icons/post-menu.svg';

function PostMenu({ post, setPosts, setUser }) {
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

                // Increase user bookmarkedPostsCount
                setUser(prevUser => {
                    return {
                        ...prevUser,
                        bookmarkedPostsCount: bookmarked ? prevUser.bookmarkedPostsCount - 1 : prevUser.bookmarkedPostsCount + 1
                    };
                });
            });
    };

    const handlePostDelete = () => {
        axios.delete(`${API_SERVER}/posts/${post.id}`, { withCredentials: true })
            .then(() => {
                // Remove deleted post from posts
                setPosts(prevPosts => prevPosts.filter(prevPost => prevPost.id !== post.id));

                // Increase user bookmarkedPostsCount
                setUser(prevUser => {
                    return {
                        ...prevUser,
                        postsCount: prevUser.postsCount - 1
                    };
                });
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
                            <IoBookmark size={18} /> Remove from bookmarks
                        </>
                    ) : (
                        <>
                            <IoBookmarkOutline size={18} /> Add to bookmarks
                        </>
                    )}
                </Dropdown.Item>
                {/* Delete dropdown item */}
                {post.author.nickname === authUser.nickname && (
                    <Dropdown.Item onClick={handlePostDelete}>
                        <FaTrashAlt size={18} color='#E64646' /> Delete post
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default PostMenu