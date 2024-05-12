import React, { useEffect } from 'react';
import { ListGroup, Image, Dropdown, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from './AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';
import { ReactComponent as More } from '../assets/icons/more.svg';
import { ReactComponent as Home } from '../assets/icons/home.svg';
import { ReactComponent as Search } from '../assets/icons/search.svg';
import { ReactComponent as Chats } from '../assets/icons/chats.svg';
import { ReactComponent as Notifications } from '../assets/icons/notification-bell.svg';
import { ReactComponent as Create } from '../assets/icons/create.svg';

function Header() {
    const { authUser, setAuthUser } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        await axios.post(`${API_SERVER}/auth/logout`, {}, { withCredentials: true });
        navigate('/sign-in');
        setAuthUser(null);
    };

    useEffect(() => {
        const pathsWithOpenHeader = ['/my-profile'];
        if (!pathsWithOpenHeader.includes(window.location.pathname) && authUser) {
            document.querySelector('.header').classList.add('closed');
        }
    }, [authUser]);

    return (
        <div className={`header d-flex flex-column ${authUser ? 'authorized' : ''}`}>
            <NavLink href='/' className='logo-container w-100 d-flex align-items-center flex-row'>
                <div className='logo'>
                    <Logo width={37.5} height={51} />
                </div>
                <div className='logo-text ms-2'>
                    <p>SKILL</p>
                    <p>SHUFFLE</p>
                </div>
            </NavLink>
            <ListGroup className='flex-grow-1'>
                <ListGroup.Item>
                    <Home className='home-icon' />
                    <p>Home</p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Search className='search-icon' />
                    <p>Search</p>
                </ListGroup.Item>
                <ListGroup.Item action href='/messenger'>
                    <Chats className='chats-icon' />
                    <p>Messages</p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Notifications className='notifications-icon' />
                    <p>Notifications</p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Create className='create-icon' />
                    <p>Create</p>
                </ListGroup.Item>
                {authUser && (
                    <>
                        <ListGroup.Item href='/my-profile' className='profile-link' action>
                            <div className='avatar-container d-flex justify-content-center align-items-center flex-column'>
                                <Image
                                    src={authUser.avatarUrl ? authUser.avatarUrl : imagePlaceholder}
                                    width={25}
                                    height={25}
                                    style={{ objectFit: 'cover', border: '1px solid #c2c2c2' }}
                                    className='avatar'
                                    alt='Avatar'
                                    roundedCircle
                                />
                            </div>
                            <p>Profile</p>
                        </ListGroup.Item>
                        <ListGroup.Item className='more-link'>
                            <Dropdown className='d-flex justify-content-center align-items-center' drop='end'>
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
                            <p>More</p>
                        </ListGroup.Item>
                    </>
                )}
            </ListGroup>
        </div>
    );
}

export default Header;