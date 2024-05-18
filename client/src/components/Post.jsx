import React from 'react';
import { Row, Col, Image, Button, Stack } from 'react-bootstrap';

import { useAuth } from '../components/AuthContext';

// import { ReactComponent as PostMenu } from '../assets/icons/post-menu.svg';
// import { ReactComponent as Like } from '../assets/icons/like.svg';
// import { ReactComponent as Comment } from '../assets/icons/comment.svg';
// import { ReactComponent as Share } from '../assets/icons/share.svg';
// import { ReactComponent as Send } from '../assets/icons/send.svg';
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg'

function Post({ post }) {
    const { authUser } = useAuth();

    const formatCreationTimestamp = () => {
        const date = new Date(post.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        if (isToday) {
            return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (isYesterday) {
            return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
        } else if (date.getFullYear() === today.getFullYear()) {
            return date.toLocaleDateString('en-US', options);
        }

        return date.toLocaleDateString('en-US', options);
    };

    return (
        <Row className='post-block position-relative flex-column p-3'>
            {/* <div className="post-menu-icon w-auto p-0 position-absolute">
                <PostMenu width={19} />
            </div> */}

            <Row className='post-user d-flex justify-content-start align-items-center'>
                <Col className='post-user-img p-0'>
                    <Image
                        src={post.author.avatarUrl || imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Col>
                <Col className='post-info'>
                    <a href={`/users?nn=${post.author.nickname}`}>
                        {post.author.firstName} {post.author.lastName}
                        <i>•</i>
                        <span>@{post.author.nickname}</span>
                    </a>
                    <div className='d-flex align-items-center p-0'>
                        <Calendar className='me-2' />
                        <span className='date'>{formatCreationTimestamp()}</span>
                    </div>
                </Col>
            </Row>
            <Row className='post-content p-0'>
                {post.text && <p>{post.text}</p>}

                {post.attachments.length > 0 && (
                    <Stack data-size={post.attachments.length} className='post-attachments d-grid' gap={2}>
                        {post.attachments.map(attachment => {
                            return (
                                <Image
                                    key={attachment.id}
                                    src={attachment.photoUrl}
                                    alt='Attachment'
                                    className='post-attachment'
                                />
                            )
                        })}
                    </Stack>
                )}
            </Row>
            {/* <Row className='post-interactions'>
                <Col>
                    <Like className='like-button' />
                    <p>13</p>
                </Col>
                <Col>
                    <Comment className='comment-button' />
                    <p>255</p>
                </Col>
                <Col>
                    <Share className='share-button' />
                    <p>400</p>
                </Col>
            </Row>
            <Row className='post-input d-flex gap-2 justify-content-start align-items-center flex-row mt-3'>
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