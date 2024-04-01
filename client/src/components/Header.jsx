import React from 'react';
import { Container, ListGroup, Image, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER, SERVER_URL } from '../config';
import { useAuth } from './AuthContext';

import Logo from '../assets/icons/logo.svg';
import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as More } from '../assets/icons/more.svg';
import { ReactComponent as Home } from '../assets/icons/home.svg';
import { ReactComponent as Search } from '../assets/icons/search.svg';
import { ReactComponent as Chats } from '../assets/icons/chats.svg';
import { ReactComponent as Notifications } from '../assets/icons/notification-bell.svg';
import { ReactComponent as Create } from '../assets/icons/create.svg';

function Header() {
    const { setAuthUser, authUser } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        await axios.post(`${API_SERVER}/auth/logout`, {}, { withCredentials: true });
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
                    <Home className='home-icon' />
                </ListGroup.Item>
                <ListGroup.Item>
                    <Search className='search-icon' />
                </ListGroup.Item>
                <ListGroup.Item action href='/messenger'>
                    <Chats className='chats-icon' />
                </ListGroup.Item>
                <ListGroup.Item>
                    <Notifications className='notifications-icon' />
                </ListGroup.Item>
                <ListGroup.Item>
                    <Create className='create-icon' />
                </ListGroup.Item>
                {authUser && (
                    <>
                        <ListGroup.Item action href='/my-profile'>
                            <div className='avatar-container d-flex justify-content-center align-items-center flex-column'>
                                <Image
                                    src={authUser.avatar_url ? `${SERVER_URL}/${authUser.avatar_url}` : imagePlaceholder}
                                    width={25}
                                    height={25}
                                    style={{ objectFit: 'cover', border: '1px solid #c2c2c2' }}
                                    className='avatar'
                                    alt='Avatar'
                                    roundedCircle
                                />
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className='dropdown-container'>
                            <Dropdown className='w-100 h-100 d-flex justify-content-center align-items-center' drop='end'>
                                <Dropdown.Toggle title='More' >
                                    <More className='more-icon' />
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
                    </>
                )}
            </ListGroup>
        </div>
    );
}

export default Header;