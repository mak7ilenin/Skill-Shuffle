import React, { useEffect, useState } from 'react';
import { Row, Col, Tab, Tabs, Button, Image, NavLink, InputGroup, Form } from 'react-bootstrap';

import { useAuth } from '../components/AuthContext';

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
    const { authUser, stompClient, isStompClientInitialized } = useAuth();

    const [text, setText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    };
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
                    <NavLink href='/' className='user-container d-flex align-items-center justify-content-between flex-row mb-2'>
                        <Row>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                className='profile-avatar p-0'
                                alt='Avatar'
                                roundedCircle
                            />
                        </Row>
                    </NavLink>
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
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Media'
                                width='70'
                                height='70'
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Row className="main-block-profile">
                    <Row className='post-block d-flex align-items-center flex-row'>
                        <Row className='add-post-line'>
                            <Row className='textarea-block'>
                                <Row className='post-user-img img-small'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Avatar'
                                        roundedCircle
                                    />
                                </Row>
                                <InputGroup className='textarea-post'>
                                    <Form.Control as="textarea" aria-label="With textarea" placeholder="What's New?"
                                        style={{ height: text.split('\n').length + 'em' }}
                                        onInput={handleChange}
                                    />
                                </InputGroup>
                            </Row>
                            <Row className='d-flex flex-column emoji-container'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='Avatar'
                                    width='30'
                                    height='30'
                                    roundedCircle
                                />
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='Avatar'
                                    width='30'
                                    height='30'
                                    roundedCircle
                                />
                            </Row>
                        </Row>
                    </Row>
                    <Row className='post-block'>
                        <div className="post-menu-icon w-auto p-0 position-absolute">
                            <PostMenu width={19} />
                        </div>
                        <Col className='post-user'>
                            <Row className='post-user-img'>
                                <NavLink href='/' className='user-container d-flex align-items-center justify-content-between flex-row mb-2'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Avatar'
                                        roundedCircle
                                    />
                                </NavLink>
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
                            <Col className='post-message d-flex justify-content-start align-items-center flex-row mt-3'>
                                <Row className='post-user-img m-0'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Avatar'
                                        style={{ objectFit: 'cover' }}
                                        roundedCircle
                                    />
                                </Row>
                                <Row className='post-user-input w-100'>
                                    <p>Durgesh Kirillovich<span> • @durgesh</span></p>
                                    <div className="input-container p-0">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Enter message..."
                                        />
                                    </div>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </Row>

                <Row className="right-block-profile">
                    <Col className='profile-aside might-like d-flex flex-column justify-content-between p-3'>
                        <p className='aside-header'>You might like</p>
                        <NavLink href='/' className='user-container d-flex align-items-center justify-content-between flex-row mb-2'>
                            <Row className='user-img p-0 me-2'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='User'
                                    width='45'
                                    height='45'
                                    style={{ objectFit: 'cover' }}
                                    roundedCircle
                                />
                            </Row>
                            <Row className='user-info'>
                                <p className='name'>Durgesh Kirillovich</p>
                                <p className='nickname'>@durgesh</p>
                            </Row>
                            <Button variant="secondary">Add friend</Button>
                        </NavLink>
                        <NavLink href='/' className='user-container d-flex align-items-center justify-content-between flex-row mb-2'>
                            <Row className='user-img p-0 me-2'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='User'
                                    width='45'
                                    height='45'
                                    style={{ objectFit: 'cover' }}
                                    roundedCircle
                                />
                            </Row>
                            <Row className='user-info'>
                                <p className='name'>Durgesh Kirillovich</p>
                                <p className='nickname'>@durgesh</p>
                            </Row>
                            <Button variant="secondary">Add friend</Button>
                        </NavLink>
                        <NavLink href='/' className='user-container d-flex align-items-center justify-content-between flex-row mb-2'>
                            <Row className='user-img p-0 me-2'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='User'
                                    width='45'
                                    height='45'
                                    style={{ objectFit: 'cover' }}
                                    roundedCircle
                                />
                            </Row>
                            <Row className='user-info'>
                                <p className='name'>Durgesh Kirillovich</p>
                                <p className='nickname'>@durgesh</p>
                            </Row>
                            <Button variant="secondary">Add friend</Button>
                        </NavLink>
                        <NavLink href='/' className='user-container d-flex align-items-center justify-content-between flex-row mb-2'>
                            <Row className='user-img p-0 me-2'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    alt='User'
                                    width='45'
                                    height='45'
                                    style={{ objectFit: 'cover' }}
                                    roundedCircle
                                />
                            </Row>
                            <Row className='user-info'>
                                <p className='name'>Durgesh Kirillovich</p>
                                <p className='nickname'>@durgesh</p>
                            </Row>
                            <Button variant="secondary">Add friend</Button>
                        </NavLink>
                        <p className='show-more-like mt-1'><a href="/">Show more</a></p>
                    </Col>

                    <Col className='profile-aside friend-list d-flex flex-column justify-content-between p-3'>
                        <p className='aside-header'>Friends online <span>3</span></p>
                        <Col className='friends-online d-flex flex-row align-items-center justify-content-start'>
                            <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                                <Row className='friend-img w-auto'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Friend'
                                        width='60'
                                        height='60'
                                        style={{ objectFit: 'cover' }}
                                        roundedCircle
                                    />
                                </Row>
                                <p>Durgesh</p>
                            </NavLink>
                            <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                                <Row className='friend-img w-auto'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Friend'
                                        width='60'
                                        height='60'
                                        style={{ objectFit: 'cover' }}
                                        roundedCircle
                                    />
                                </Row>
                                <p>Durgesh</p>
                            </NavLink>
                            <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                                <Row className='friend-img w-auto'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Friend'
                                        width='60'
                                        height='60'
                                        style={{ objectFit: 'cover' }}
                                        roundedCircle
                                    />
                                </Row>
                                <p>Durgesh</p>
                            </NavLink>
                            <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                                <Row className='friend-img w-auto'>
                                    <Image
                                        src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Friend'
                                        width='60'
                                        height='60'
                                        style={{ objectFit: 'cover' }}
                                        roundedCircle
                                    />
                                </Row>
                                <p>Durgesh</p>
                            </NavLink>
                        </Col>

                        <hr />

                        <p className='aside-header'>Friends <span>3</span></p>
                        <Col className='friends d-flex flex-row align-items-center justify-content-start'>
                            <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                                <Row className='friend-img'>
                                    <Image
                                        src={authUser.avatarUrl !== null ? authUser.avatarUrl : imagePlaceholder}
                                        alt='Friend'
                                        width='60'
                                        height='60'
                                        style={{ objectFit: 'cover' }}
                                        roundedCircle
                                    />
                                </Row>
                                <p>Durgesh</p>
                            </NavLink>
                        </Col>
                    </Col>
                </Row>
            </Row>
        </Col>
    );
}

export default Profile;