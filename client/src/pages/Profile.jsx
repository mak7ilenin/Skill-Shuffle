import React, { useEffect } from 'react';
import { Row, Col, Tab, Tabs, Button, Image } from 'react-bootstrap';

import { STATIC_RESOURCES } from '../config';
import { useAuth } from '../components/AuthContext';
import CreateImage from '../components/CreateImage';

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
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function Profile() {
    const { authUser } = useAuth();

    useEffect(() => {
        document.querySelector('.default-header').classList.remove('closed');
    }, []);

    return (
        <Col className='wrapper-profile'>
            <Row className="profile-banner w-100 justify-content-end align-items-end">
                <Button className='profile-btn'>
                    <EditBanner />
                </Button>
            </Row>

            <Col className='profile-header-list-container w-100'>
                <Tabs defaultActiveKey="Posts" className="profile-header-list">
                    <Tab
                        eventKey="Posts"
                        title={
                            <Row>
                                <p>Posts <span className='fw-bold'>13</span></p>
                            </Row>
                        }
                    />
                    <Tab
                        eventKey="Likes"
                        title={
                            <Row>
                                <p>Likes <span className='fw-bold'>13</span></p>
                            </Row>
                        }
                    />
                    <Tab
                        eventKey="Bookmarks"
                        title={
                            <Row>
                                <p>Bookmarks <span className='fw-bold'>13</span></p>
                            </Row>
                        }
                    />
                </Tabs>
            </Col>

            <Row className='d-flex profile-content'>
                <Col className='profile-info-container d-flex justify-content-start flex-column'>
                    <Row>
                        <Image
                            src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                            className='profile-avatar p-0'
                            alt='Avatar'
                            roundedCircle
                        />
                    </Row>

                    <Row className='profile-info'>
                        <p className='user-name'>Durgesh Kirillovich</p>
                        <Col className='d-flex flex-row align-items-center'>
                            <p className='nickname'>@durgesh</p>
                            <Trophy width={18} height={18} className='mx-2' />
                            <p className='points'>19k points</p>
                        </Col>
                    </Row>

                    <Row className="mt-4" style={{ color: '#8F8F8F', fontSize: '13px' }}>
                        <Col className='d-flex flex-row align-items-center mb-2'>
                            <Calendar className='me-2' />
                            <p style={{ fontWeight: '500' }}>Joined in September 2023</p>
                        </Col>
                        <Col className='d-flex flex-row align-items-center mb-2'>
                            <BornIn className='me-2' />
                            <p style={{ fontWeight: '500' }}>Born in December 22</p>
                        </Col>
                    </Row>

                    <hr></hr>

                    <Row className='profile-bio'>
                        <p className='p-0'>Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!</p>
                        <Button variant="none">Edit profile</Button>
                    </Row>

                    <Row className='profile-links'>
                        <Col className='d-flex flex-row mb-1 align-items-center'>
                            <Friends className='me-2' />
                            <p><span>24</span> • <a href="/">friends</a></p>
                        </Col>
                        <Col className='d-flex flex-row my-1 align-items-center'>
                            <Favorite className='me-2' />
                            <p><span>15</span> • <a href="/">followers</a></p>
                        </Col>
                        <Col className='d-flex flex-row my-1 align-items-center'>
                            <Subscriptions className='me-2' />
                            <p><span>34</span> • <a href="/">subscriptions</a></p>
                        </Col>
                        <Col className='d-flex flex-row mt-1 align-items-center'>
                            <Photos className='me-2' />
                            <p><span>7</span> • <a href="/">photos and videos</a></p>
                        </Col>
                    </Row>

                    <Row className='d-flex flex-row mt-3 photos-videos-block'>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                            />
                        </Col>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                        <Col>
                            <CreateImage
                                url={authUser.avatarUrl}
                                alt={'Media'}
                                width={70}
                                height={70}
                                rounded={false}
                            />
                        </Col>
                    </Row>
                </Col>

                <Row className="main-block-profile tab-content">
                    <Row className='post-block'>
                        <div className="post-menu-icon w-auto p-0 position-absolute">
                            <PostMenu width={19} />
                        </div>
                        <Col className='post-user'>
                            <Row className='post-user-img'>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Row>
                            <Row style={{ fontSize: '18px' }}>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span></a> • <a href='/'><span>@durgesh</span></a></p>
                                <div className='d-flex align-items-center p-0'>
                                    <Calendar className='me-2' />
                                    <span>20 september</span>
                                </div>
                            </Row>
                        </Col>
                        <Col className='post-main-block'>
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
                        </Col>
                        <Col className='reactions-block'>
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
                        </Col>
                        <Col className='post-messages'>
                            <Col className='post-message'>
                                <Row className='post-user-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <Row style={{ fontSize: '18px' }}>
                                    <p style={{ width: 'fit-content' }}><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span> • <span>@durgesh</span></p>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="exampleFormControlInput1"
                                            placeholder="Type message"
                                        />
                                        {/* <EmojiGifPicker setMessageContent={setMessageContent} sendMessage={sendMessage} /> */}
                                    </span>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </Row>

                <Row className="right-block-profile">
                    <Col className='right-block'>
                        <p className='r-block-m-p'>You might like</p>
                        <Col className='post-user-right'>
                            <Row className='post-user-img'>
                                <Image
                                    src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                />
                            </Row>
                            <Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span></a></p>
                                <p><a href='/'><span>@durgesh</span></a></p>
                            </Row>
                            <Button variant="secondary" style={{ fontFamily: 'Manrope', fontWeight: 'bold', marginTop: '10px' }}>Add friend</Button>{' '}
                        </Col>
                        <Col className='post-user-right'>
                            <Row className='post-user-img'>
                                <Image
                                    src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                />
                            </Row>
                            <Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span></a></p>
                                <p><a href='/'><span>@durgesh</span></a></p>
                            </Row>
                            <Button variant="secondary" style={{ fontFamily: 'Manrope', fontWeight: 'bold', marginTop: '10px' }}>Add friend</Button>{' '}
                        </Col>
                        <Col className='post-user-right'>
                            <Row className='post-user-img'>
                                <Image
                                    src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                />
                            </Row>
                            <Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span></a></p>
                                <p><a href='/'><span>@durgesh</span></a></p>
                            </Row>
                            <Button variant="secondary" style={{ fontFamily: 'Manrope', fontWeight: 'bold', marginTop: '10px' }}>Add friend</Button>{' '}
                        </Col>
                        <p className='show-more-like'><a href="/">Show more</a></p>
                    </Col>

                    <Col className='right-block'>
                        <p className='r-block-m-p'>Friends online <span>3</span></p>
                        <Row className='friends-online'>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                        </Row>
                        <hr />
                        <p className='r-block-m-p'>Friends <span>3</span></p>
                        <Col className='friends'>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${STATIC_RESOURCES}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                        </Col>
                    </Col>
                </Row>
            </Row>
        </Col>
    );
}

export default Profile;