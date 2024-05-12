import React, { useEffect } from 'react';
import { Row, Col, Tab, Tabs, Button, Image, Container } from 'react-bootstrap';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileHeader from '../components/ProfileHeader';

import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';
import { ReactComponent as Trophy } from '../assets/icons/pointsTrophy.svg';
import { ReactComponent as BornIn } from '../assets/icons/bornIn.svg';
import { ReactComponent as Friends } from '../assets/icons/friendsIcon.svg';
import { ReactComponent as Subscriptions } from '../assets/icons/subscriptionsIcon.svg';
import { ReactComponent as Photos } from '../assets/icons/photosIcon.svg';
import { ReactComponent as Favorite } from '../assets/icons/favorite.svg';
import { ReactComponent as Calendar } from '../assets/icons/calendar.svg';
import { ReactComponent as PostMenu } from '../assets/icons/post-menu.svg';
import { ReactComponent as Like } from '../assets/icons/like.svg';
import { ReactComponent as Comment } from '../assets/icons/comment.svg';
import { ReactComponent as Share } from '../assets/icons/share.svg';
import { ReactComponent as Send } from '../assets/icons/send.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function Profile() {
    const { authUser } = useAuth();

    useEffect(() => {
        document.querySelector('.header').classList.remove('closed');
    }, []);

    return (
        <div className='wrapper-profile pb-5'>
            <Row className="profile-banner w-100 justify-content-end align-items-end">
                <Button variant='none' className='profile-btn border-0 p-2 mb-3 me-3 rounded-circle d-flex justify-content-center'>
                    <EditBanner />
                </Button>
            </Row>

            <Row className='profile-header native w-100'>
                <ProfileHeader />
            </Row>

            <Container className='d-flex mx-auto my-0 profile-content'>
                <Row className='left-mid-block m-0 p-0'>
                    <Col className='profile-info-block d-flex justify-content-start flex-column'>
                        <div className="first-col">
                            <Row className='profile-avatar'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='Avatar'
                                    roundedCircle
                                />
                            </Row>

                            <Row className='profile-info mb-4'>
                                <p className='user-name'>Durgesh Kirillovich</p>
                                <Col className='d-flex flex-row align-items-center'>
                                    <p className='nickname'>@durgesh</p>
                                    <Trophy width={18} height={18} className='mx-2' />
                                    <p className='points'>19k points</p>
                                </Col>
                            </Row>

                            <Row className="profile-statistics flex-column">
                                <Col className='d-flex flex-row align-items-center mb-2'>
                                    <Calendar className='me-2' />
                                    <p>Joined in September 2023</p>
                                </Col>
                                <Col className='d-flex flex-row align-items-center mb-2'>
                                    <BornIn className='me-2' />
                                    <p>Born in December 22</p>
                                </Col>
                            </Row>

                            <hr></hr>

                            <Row className='profile-bio flex-column'>
                                <p className='p-0'>Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!</p>
                                <Button variant="secondary">Edit profile</Button>
                            </Row>
                        </div>


                        <div className="second-col">
                            <Row className='profile-links flex-column mt-2'>
                                <Col className='d-flex flex-row mb-1 align-items-center'>
                                    <Friends className='me-2' />
                                    <p>
                                        <span>24</span> • <a href="/">friends</a>
                                    </p>
                                </Col>
                                <Col className='d-flex flex-row my-1 align-items-center'>
                                    <Favorite className='me-2' />
                                    <p>
                                        <span>15</span> • <a href="/">followers</a>
                                    </p>
                                </Col>
                                <Col className='d-flex flex-row my-1 align-items-center'>
                                    <Subscriptions className='me-2' />
                                    <p>
                                        <span>34</span> • <a href="/">subscriptions</a>
                                    </p>
                                </Col>
                                <Col className='d-flex flex-row mt-1 align-items-center'>
                                    <Photos className='me-2' />
                                    <p>
                                        <span>7</span> • <a href="/">photos and videos</a>
                                    </p>
                                </Col>
                            </Row>

                            <Row className='mt-3 profile-media'>
                                <Image src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder} alt='Media' />
                                <Image src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder} alt='Media' />
                                <Image src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder} alt='Media' />
                                <Image src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder} alt='Media' />
                                <Image src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder} alt='Media' />
                                <Image src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder} alt='Media' />
                            </Row>
                        </div>
                    </Col>

                    <Row className='profile-header w-100'>
                        <ProfileHeader />
                    </Row>

                    <Col className="main-block-profile tab-content">
                        <Row className='post-block position-relative flex-column p-3'>
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
                    </Col>
                </Row>

                <ProfileAside />

            </Container>
        </div>
    );
}

export default Profile;