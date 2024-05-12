import React from 'react';
import { Col, Row, Image, Button, NavLink } from 'react-bootstrap';

import { useAuth } from '../components/AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function ProfileAside() {
    const { authUser } = useAuth();

    return (
        <Col className="right-block-profile d-flex flex-column">
            <Col className='profile-aside might-like d-flex flex-column justify-content-between p-3'>
                <p className='aside-header'>You might like</p>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <Row className='user-container d-flex align-items-center justify-content-between'>
                    <Col className='user-img p-0 me-2'>
                        <Image
                            src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                            alt='User'
                            roundedCircle
                        />
                    </Col>
                    <Col className='user-info'>
                        <p className='name'>Durgesh Kirillovich</p>
                        <p className='nickname'>@durgesh</p>
                    </Col>
                    <Col className='btn-container'>
                        <Button variant="secondary">Add friend</Button>
                    </Col>
                </Row>
                <p className='show-more mt-1'>Show more</p>
            </Col>

            <Col className='profile-aside friend-list d-flex flex-column justify-content-between p-3'>
                <p className='aside-header'>Friends online <span>3</span></p>
                <Col className='friends-online d-flex flex-row align-items-center justify-content-between'>
                    <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                        <Row className='friend-img w-auto'>
                            <Image
                                src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                alt='Friend'
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
                                roundedCircle
                            />
                        </Row>
                        <p>Durgesh</p>
                    </NavLink>
                </Col>

                <hr className='my-2' />

                <p className='aside-header'>Friends <span>3</span></p>
                <Col className='friends d-flex flex-row align-items-center justify-content-between'>
                    <NavLink href='/' className='friend-container d-flex justify-content-start align-items-center flex-column'>
                        <Row className='friend-img'>
                            <Image
                                src={authUser.avatarUrl !== null ? authUser.avatarUrl : imagePlaceholder}
                                alt='Friend'
                                roundedCircle
                            />
                        </Row>
                        <p>Durgesh</p>
                    </NavLink>
                </Col>
            </Col>
        </Col>
    )
}

export default ProfileAside;