import React, { useState } from 'react';
import { Row, Col, Image, Button, Stack, Spinner } from 'react-bootstrap';
import axios from 'axios';

import PostMenu from './PostMenu';
import { useAuth } from '../components/AuthContext';
import { API_SERVER } from '../config';

import { ReactComponent as Like } from '../assets/icons/like.svg';
import { ReactComponent as Comment } from '../assets/icons/comment.svg';
import { ReactComponent as Share } from '../assets/icons/share.svg';
import { ReactComponent as Send } from '../assets/icons/send.svg';
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg';
import { BiRepost } from "react-icons/bi";
import imagePlaceholder from '../assets/icons/image-placeholder.svg'

function Post({ post, setPosts, setUser }) {
    const { authUser } = useAuth();
    const [loadedImages, setLoadedImages] = useState(0);
    const [liked, setLiked] = useState(post.liked);

    const formatCreationTimestamp = () => {
        const date = new Date(post.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.getDate() === today.getDate()
            && date.getMonth() === today.getMonth()
            && date.getFullYear() === today.getFullYear();

        const isYesterday = date.getDate() === yesterday.getDate()
            && date.getMonth() === yesterday.getMonth()
            && date.getFullYear() === yesterday.getFullYear();

        if (isToday) {
            return `Today at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (isYesterday) {
            return `Yesterday at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (date.getFullYear() === today.getFullYear()) {
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
        }

        return date.toLocaleDateString('en-GB', { year: 'numeric', day: 'numeric', month: 'long' });
    };

    const formatText = () => {
        return post.text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const handlePostLike = (post) => {
        axios.post(`${API_SERVER}/posts/${post.id}/like`, {}, { withCredentials: true })
            .then(() => {
                // Update post with new like status
                setPosts(prevPosts => prevPosts.map(prevPost => {
                    if (prevPost.id === post.id) {
                        return {
                            ...prevPost,
                            liked: !liked,
                            likesCount: liked ? prevPost.likesCount - 1 : prevPost.likesCount + 1
                        };
                    }
                    return prevPost;
                }));
                setLiked(!liked);

                if (setUser) {
                    setUser(prevUser => {
                        return {
                            ...prevUser,
                            likedPostsCount: liked ? prevUser.likedPostsCount - 1 : prevUser.likedPostsCount + 1
                        };
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlePostComment = () => {
        // TODO: Implement comment functionality

    };

    const handlePostShare = () => {
        axios.post(`${API_SERVER}/posts/${post.id}/share`, {}, { withCredentials: true })
            .then(() => {
                // Update shares count on post
                setPosts(prevPosts => prevPosts.map(prevPost => {
                    if (prevPost.id === post.id) {
                        return {
                            ...prevPost,
                            sharesCount: prevPost.sharesCount + 1
                        };
                    }
                    return prevPost;
                }));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Row className='post-block position-relative flex-column p-3'>
            <div className="post-menu-icon w-auto p-0 position-absolute">
                <PostMenu post={post} setPosts={setPosts} />
            </div>

            <Row className='post-user d-flex justify-content-start align-items-center'>
                <Col className='post-user-img p-0'>
                    <Image
                        src={post.author.avatarUrl || imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Col>
                <Col className='post-info'>
                    <p>
                        <a href={`/users?nn=${post.author.nickname}`}>
                            {post.author.firstName} {post.author.lastName}
                        </a>
                        <i>•</i>
                        <span>@{post.author.nickname}</span>
                    </p>
                    <div className='d-flex align-items-center p-0'>
                        <Calendar className='me-2' />
                        <span className='date'>{formatCreationTimestamp()}</span>

                        {post.reposted && (
                            <div className='reposted'>
                                <BiRepost size={22} />
                                <span className='ms-1'>Reposted</span>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className='post-content p-0'>
                <p>{formatText()}</p>

                {post.attachments && post.attachments.length > 0 && (
                    <Stack data-size={post.attachments.length} className='post-attachments d-grid' gap={2}>
                        {loadedImages < post.attachments.length ? (
                            <div className='post-attachments-loading d-flex justify-content-center align-items-center'>
                                <Spinner animation="border" role="status" />
                            </div>
                        ) : null}
                        {post.attachments.map(attachment => (
                            <Image
                                key={attachment.url}
                                src={attachment.url}
                                onLoad={() => setLoadedImages(prevState => prevState + 1)}
                                className='post-attachment'
                            />
                        ))}
                    </Stack>
                )}
            </Row>
            <Row className='post-interactions'>
                <Col
                    className={`like-button ${liked ? 'active' : ''}`}
                    onClick={() => handlePostLike(post)}
                >
                    <Like />
                    <p>{post.likesCount}</p>
                </Col>

                {/* <Col className='comment-button'>
                    <Comment />
                    <p>{post.commentsCount}</p>
                </Col> */}

                {authUser.nickname !== post.author.nickname && (
                    <Col
                        className='share-button'
                        onClick={() => handlePostShare(post)}
                    >
                        <Share />
                        <p>{post.sharesCount}</p>
                    </Col>
                )}

            </Row>
            {/* <Row className='post-input d-flex gap-2 justify-content-start align-items-center flex-row mt-3'>
                <Col className='user-img m-0'>
                    <Image
                        src={authUser.avatarUrl || imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Col>
                <Col className='input-container w-100'>
                    <p>
                        {authUser.firstName} {authUser.lastName}
                        <span> • @{authUser.nickname}</span>
                    </p>
                    <Row className='d-flex'>
                        <input
                            type="text"
                            placeholder='Enter message...'
                            className='w-100 ps-2'
                        />
                        <Button variant='primary'>
                            <Send width={16} height={16} />
                        </Button>
                    </Row>
                </Col>
            </Row> */}
        </Row>
    )
}

export default Post