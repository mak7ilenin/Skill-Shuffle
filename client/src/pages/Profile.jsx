import React, { useState, useEffect } from 'react';
import { Row, Col, Tab, Tabs, Button, Image } from 'react-bootstrap';
import { ReactComponent as EditBanner } from '../assets/icons/edit_Banner.svg';
import { API_SERVER, STATIC_RESOURCES } from '../config';
import { useAuth } from '../components/AuthContext';
import Trophy from '../assets/icons/pointsTrophy.svg';
import BornIn from '../assets/icons/bornIn.svg';
import Friends from '../assets/icons/friendsIcon.svg';
import Subscriptions from '../assets/icons/subscriptionsIcon.svg';
import Photos from '../assets/icons/photosIcon.svg';
import Favorite from '../assets/icons/favorite.svg';
import Calendar from '../assets/icons/calendar.svg';
import PostMenu from '../assets/icons/post-menu.svg';
import like from '../assets/icons/like.svg';
import comment from '../assets/icons/comment.svg';
import share from '../assets/icons/share.svg';
import {
    MDBIcon,
} from "mdb-react-ui-kit";
import EmojiGifPicker from '../components/EmojiGifPicker';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function Profile() {
    const { authUser } = useAuth();
    return (
        <Col className='wrapper-profile'>
            <Row className="profile-banner">
                <Button className='profile-btn'>
                    <EditBanner />
                </Button>
            </Row>
            <Col className='profile-header-list-container'>
                <Tabs defaultActiveKey="Posts" className="profile-header-list">
                    <Tab eventKey="Posts" title={<Col><p>Posts</p><p><b>13</b></p></Col>}>
                    </Tab>
                    <Tab eventKey="Likes" title={<Col><p>Likes</p><p><b>13</b></p></Col>}>
                        {/* <p>Likes</p>
                        <p><b>255</b></p> */}
                    </Tab>
                    {/* <Tab eventKey="Answers" title={<Col><p>Answers</p><p><b>13</b></p></Col>}>
                        <p>Answers</p>
                        <p><b>13</b></p>
                    </Tab>
                    <Tab eventKey="Questions" title={<Col><p>Questions</p><p><b>13</b></p></Col>}>
                        <p>Questions</p>
                        <p><b>13</b></p>
                    </Tab> */}
                    <Tab eventKey="Bookmarks" title={<Col><p>Bookmarks</p><p><b>13</b></p></Col>}>
                        {/* <p>Bookmarks</p>
                        <p><b>2</b></p> */}
                    </Tab>
                </Tabs>
            </Col>
            <Row className='d-flex' style={{ fontFamily: 'Manrope', fontWeight: '600', width: 'fit-content' }}>
                <Row className='d-flex flex-column info-profile'>
                    <Row>
                        <Image
                            src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                            style={{ padding: 'unset' }}
                            className='profile-avatar'
                            alt='Avatar'
                            roundedCircle
                        />
                    </Row>
                    <Row>
                        <p className='nickname'>Durgesh Kirillovich</p>
                        <Col className='d-flex flex-row w-auto'>
                            <p style={{ color: '#8F8F8F', fontSize: '18px', paddingRight: '7px', fontWeight: '400' }}>@durgesh</p>
                            <Image
                                src={Trophy}
                                style={{ padding: 'unset', paddingRight: '7px' }}
                            />
                            <p style={{ color: '#3D00FF', fontSize: '18px' }}>19k points</p>
                        </Col>
                    </Row>
                    <Row className="marginTopDates" style={{ color: '#8F8F8F', fontSize: '13px' }}>
                        <Col className='d-flex flex-row'>
                            <Image
                                src={Calendar}
                                style={{ padding: 'unset', paddingRight: '7px' }}
                            />
                            <p style={{ fontWeight: '500' }}>Joined in September 2023</p>
                        </Col>
                        <Col className='d-flex flex-row'>
                            <Image
                                src={BornIn}
                                style={{ padding: 'unset', paddingRight: '7px' }}
                            />
                            <p style={{ fontWeight: '500' }}>Born in December 22</p>
                        </Col>
                    </Row>
                    <hr></hr>
                    <Row>
                        <p style={{ color: '#373737', paddingLeft: '0px' }}>Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!</p>
                        <Button variant="secondary" style={{ fontFamily: 'Manrope', fontWeight: 'bold', marginTop: '10px' }}>Edit profile</Button>{' '}
                    </Row>
                    <Row className='profile-links'>
                        <Col className='d-flex flex-row mb-1'>
                            <Image
                                src={Friends}
                                style={{ padding: 'unset', paddingRight: '8px' }}
                            />
                            <p><span>24</span> • <a href="/">friends</a></p>
                        </Col>
                        <Col className='d-flex flex-row my-1'>
                            <Image
                                src={Favorite}
                                style={{ padding: 'unset', paddingRight: '8px' }}
                            />
                            <p><span>15</span> • <a href="/">followers</a></p>
                        </Col>
                        <Col className='d-flex flex-row my-1'>
                            <Image
                                src={Subscriptions}
                                style={{ padding: 'unset', paddingRight: '8px' }}
                            />
                            <p><span>34</span> • <a href="/">subscriptions</a></p>
                        </Col>
                        <Col className='d-flex flex-row my-1'>
                            <Image
                                src={Photos}
                                style={{ padding: 'unset', paddingRight: '8px' }}
                            />
                            <p><span>7</span> • <a href="/">photos and videos</a></p>
                        </Col>
                        <Col className='d-flex flex-row mt-1 photos-videos-block'>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Col>
                        </Col>
                    </Row>
                </Row>
                <Row className="main-block-profile tab-content">
                    <Row className='post-block'>
                        <Image
                            src={PostMenu}
                            style={{ padding: 'unset', position: 'absolute', width: '19px', right: '19px', top: '25px' }}
                        />
                        <Col className='post-user'>
                            <Row className='post-user-img'>
                                <Image
                                    src={authUser.avatarUrl ? `${STATIC_RESOURCES}/${authUser.avatarUrl}` : imagePlaceholder}
                                />
                            </Row>
                            <Row style={{ fontSize: '18px' }}>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span></a> • <a href='/'><span>@durgesh</span></a></p>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image
                                        src={Calendar}
                                        style={{ padding: 'unset', paddingRight: '7px' }}
                                    />
                                    20 september
                                </span>
                            </Row>
                        </Col>
                        <Col className='post-main-block'>
                            <p>♥ Such a beautiful  day ♥ <br></br>Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!Explorer of art, nature, and cultures. Travel enthusiast, book lover, and social good advocate. Let's connect and share experiences!</p>
                        </Col>
                        <Col className='reactions-block'>
                            <Col>
                                <svg className='like-button' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.4997 16.935C17.1468 18.4095 15.426 20.1732 13.3328 22.2288C13.3324 22.2292 13.332 22.2296 13.3316 22.23L12.5 23.0426L11.6684 22.23C11.668 22.2296 11.6676 22.2292 11.6672 22.2288C9.57398 20.1732 7.85316 18.4095 6.50034 16.935C5.15398 15.4676 4.10711 14.176 3.34435 13.0569C2.5811 11.9371 2.08627 10.9626 1.81652 10.128C1.53832 9.26728 1.4 8.39073 1.4 7.49319C1.4 5.67146 1.94915 4.23796 3.00034 3.09226C4.04506 1.9536 5.30497 1.4 6.875 1.4C7.73381 1.4 8.54737 1.59584 9.33252 1.9964C10.1207 2.39851 10.8074 2.96716 11.396 3.72199L12.5 5.13757L13.604 3.72199C14.1926 2.96716 14.8793 2.39851 15.6675 1.9964C16.4526 1.59584 17.2662 1.4 18.125 1.4C19.695 1.4 20.9549 1.9536 21.9997 3.09226C23.0508 4.23796 23.6 5.67146 23.6 7.49319C23.6 8.39073 23.4617 9.26729 23.1835 10.128C22.9137 10.9626 22.4189 11.9371 21.6556 13.0569C20.8929 14.176 19.846 15.4676 18.4997 16.935Z" stroke="#8F8F8F" stroke-width="2.8" />
                                </svg>
                                <p>13</p>

                            </Col>
                            <Col>
                                <Image
                                    src={comment}
                                // style={{ padding: 'unset', paddingRight: '7px'}}
                                />
                                <p>255</p>
                            </Col>
                            <Col>
                                <Image
                                    src={share}
                                // style={{ padding: 'unset', paddingRight: '7px'}}
                                />
                                <p>400</p>
                            </Col>
                        </Col>
                        <Col className='post-messages'>
                            <Col className='post-message'>
                                <Row className='post-user-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <Row style={{ fontSize: '18px' }}>
                                    <p style={{ width: 'fit-content' }}><span style={{ color: 'black', fontWeight: '800' }}>Durgesh Kirillovich</span> • <span>@durgesh</span></p>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            class="form-control form-control-lg"
                                            id="exampleFormControlInput1"
                                            placeholder="Type message"
                                        ></input>
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
                                    src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
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
                                    src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
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
                                    src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
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
                        <Col className='friends-online'>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                        </Col>
                        <hr />
                        <p className='r-block-m-p'>Friends <span>3</span></p>
                        <Col className='friends'>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                    />
                                </Row>
                                <p><a href='/'><span style={{ color: 'black', fontWeight: '800' }}>Durgesh</span></a></p>
                            </Col>
                            <Col className='post-friend-right'>
                                <Row className='post-friend-img'>
                                    <Image
                                        src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
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