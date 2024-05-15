import React, { useEffect, useState } from 'react';
import { ListGroup, Image, Dropdown, NavLink, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import { useAuth } from './AuthContext';
import NavBlock from './NavBlock';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';
import { ReactComponent as More } from '../assets/icons/more.svg';
import { ReactComponent as Home } from '../assets/icons/home.svg';
import { ReactComponent as Search } from '../assets/icons/search.svg';
import { ReactComponent as Chats } from '../assets/icons/chats.svg';
import { ReactComponent as Notifications } from '../assets/icons/notification-bell.svg';
import { ReactComponent as Create } from '../assets/icons/create.svg';
import { SlArrowLeft } from "react-icons/sl";

function Header() {
    const { authUser, setAuthUser } = useAuth();
    const navigate = useNavigate();
    const [navBlockVisibility, setNavBlockVisibility] = useState(false);
    const [opened, setOpened] = useState(false);
    const [closed, setClosed] = useState(false);
    const [compacted, setCompacted] = useState(false);

    const logout = async () => {
        await axios.post(`${API_SERVER}/auth/logout`, {}, { withCredentials: true });
        navigate('/sign-in');
        setAuthUser(null);
    };

    const handleNavClick = () => {
        setNavBlockVisibility(!navBlockVisibility);
        navBlockVisibility ? setCompacted(false) : setCompacted(true);
    };

    const handleBurgerExit = (e) => {
        e.preventDefault();

        if (navBlockVisibility) {
            setNavBlockVisibility(false);
            return;
        }
        setOpened(false);
        document.querySelector('body').removeAttribute('style');
    };

    useEffect(() => {
        const pathsWithOpenHeader = ['/my-profile'];
        if (!pathsWithOpenHeader.includes(window.location.pathname) && authUser) {
            setClosed(true);
        }
    }, [authUser]);

    return (
        <>
            <div
                className={`header d-flex flex-column ${authUser ? 'authorized' : ''} ${closed ? 'closed' : ''} ${opened ? 'opened' : ''} ${compacted ? 'compacted' : ''}`}
            >
                <div className="burger-exit h-100">
                    <Button
                        variant='none'
                        className='px-3 rounded-0 border-0 h-100 w-100'
                        onClick={handleBurgerExit}
                    >
                        <SlArrowLeft />
                    </Button>
                </div>
                <div className='logo-block w-100 d-flex'>
                    <NavLink href='/' className="logo-container d-flex flex-row align-items-center">
                        <div className='logo'>
                            <Logo width={37.5} height={51} />
                        </div>
                        <div className='logo-text ms-2'>
                            <p>SKILL</p>
                            <p>SHUFFLE</p>
                        </div>
                    </NavLink>
                    <div className="burger-menu h-100">
                        <Button
                            variant='none'
                            className='px-3 rounded-0 border-0'
                            onClick={e => {
                                e.preventDefault();
                                setOpened(true);
                                document.querySelector('body').style.overflow = 'hidden';
                            }}
                        >
                            <More width={30} />
                        </Button>
                    </div>
                </div>
                <ListGroup className='flex-grow-1'>
                    <ListGroup.Item>
                        <Home className='home-icon' />
                        <p>Home</p>
                    </ListGroup.Item>
                    <ListGroup.Item onClick={handleNavClick}>
                        <Search className='search-icon' />
                        <p>Search</p>
                    </ListGroup.Item>
                    <ListGroup.Item action href='/messenger'>
                        {authUser && authUser.unreadMessages > 0 && (
                            <div className="unread-messages">
                                <span>{authUser.unreadMessages}</span>
                            </div>
                        )}
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
                                <Dropdown className='w-100 h-100 d-flex justify-content-center align-items-center'>
                                    <Dropdown.Toggle className='w-100 h-100 border-0 p-0 d-flex align-items-center flex-row' title='More' >
                                        <More className='more-icon' />
                                        <p>More</p>
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

            {navBlockVisibility && (
                <NavBlock />
            )}
        </>
    );
}

export default Header;