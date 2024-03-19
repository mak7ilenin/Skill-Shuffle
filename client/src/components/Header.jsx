import React from 'react';
import { Container, ListGroup, Image, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER, SERVER_URL } from '../config';
import { useAuth } from './AuthContext';

import Logo from '../assets/icons/logo.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import more from '../assets/icons/more.svg';
import home from '../assets/icons/home.svg';
import search from '../assets/icons/search.svg';
import chats from '../assets/icons/chats.svg';
import notifications from '../assets/icons/notification-bell.svg';
import create from '../assets/icons/create.svg';

function Header({ setIsAuthenticated }) {
    const { setAuthUser, authUser } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        await axios.post(`${API_SERVER}/auth/logout`, {}, { withCredentials: true });
        setIsAuthenticated(false);
        setAuthUser(null);
        navigate('/sign-in');
    };

    return (
        <div className='default-header d-flex flex-column closed'>
            <Container className='logo-container w-100 d-flex justify-content-center align-items-center'>
                <a href="/">
                    <Image
                        src={Logo}
                        className='logo'
                        alt='Logo'
                        width={37.5}
                        height={51}
                    />
                </a>
            </Container>
            <ListGroup className='flex-grow-1'>
                <ListGroup.Item>
                    <img src={home} alt='Home' />
                </ListGroup.Item>
                <ListGroup.Item>
                    <img src={search} alt='Search' />
                </ListGroup.Item>
                <ListGroup.Item action href='/messenger'>
                    <img src={chats} alt='Chats' />
                </ListGroup.Item>
                <ListGroup.Item>
                    <img src={notifications} alt='Notifications' />
                </ListGroup.Item>
                <ListGroup.Item>
                    <img src={create} alt='Create' />
                </ListGroup.Item>
                {authUser ? (
                    <ListGroup.Item>
                        <div className='avatar-container d-flex justify-content-center align-items-center flex-column'>
                            <Image
                                src={authUser.avatar_url !== null ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                width={25}
                                height={25}
                                style={{ objectFit: 'cover', border: '1px solid #c2c2c2' }}
                                className='avatar'
                                alt='Avatar'
                                roundedCircle
                            />
                        </div>
                    </ListGroup.Item>
                ) : null}
                {authUser ? (
                    <ListGroup.Item className='dropdown-container'>
                        <Dropdown className='w-100 h-100 d-flex justify-content-center align-items-center'>
                            <Dropdown.Toggle>
                                <img src={more} alt="More" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Saved</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Switch appearance</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Report a problem</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ListGroup.Item>
                ) : null}
            </ListGroup>
        </div>
    )
}

export default Header;