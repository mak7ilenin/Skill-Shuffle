import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

import { useAuth } from '../components/AuthContext';

import { ReactComponent as PostMenu } from '../assets/icons/post-menu.svg';
import { ReactComponent as Like } from '../assets/icons/like.svg';
import { ReactComponent as Comment } from '../assets/icons/comment.svg';
import { ReactComponent as Share } from '../assets/icons/share.svg';
import { ReactComponent as Send } from '../assets/icons/send.svg';
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg'

function Post({ post }) {
    const { authUser } = useAuth();

    return (
        <Row key={post.id} className='post-block position-relative flex-column p-3'>
            <div className="post-menu-icon w-auto p-0 position-absolute">
                <PostMenu width={19} />
            </div>
            <Row className='post-user d-flex justify-content-start align-items-center'>
                <Col className='post-user-img p-0'>
                    <Image
                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Col>
                <Col className='post-info'>
                    <a href='/'>Durgesh Kirillovich <i>•</i> <span>@durgesh</span></a>
                    <div className='d-flex align-items-center p-0'>
                        <Calendar className='me-2' />
                        <span>20 september</span>
                    </div>
                </Col>
            </Row>
            <Row className='post-content p-0'>
                <p>
                    ♥ Such a beautiful  day ♥ <br></br>Explorer of art, nature, and cultures. Travel enthusiast, book lover,
                    and social good advocate. Let's connect and share experiences!Explorer of art, nature,
                    and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!Explorer of art,
                    nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!
                    Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate.
                    Let's connect and share experiences!Explorer of art, nature, and cultures. Travel enthusiast, book lover,
                    and social good advocate. Let's connect and share experiences!Explorer of art, nature, and cultures.
                    Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!
                </p>
            </Row>
            <Row className='post-interactions'>
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
                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                        alt='Avatar'
                        roundedCircle
                    />
                </Col>
                <Col className='input-container w-100'>
                    <p>Durgesh Kirillovich<span> • @durgesh</span></p>
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
            </Row>
        </Row>
    )
}

export default Post