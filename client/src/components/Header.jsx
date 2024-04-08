import React from 'react';
import { Container, ListGroup, Image, Dropdown, Row } from 'react-bootstrap';
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
import { useEffect } from 'react';

function Header() {
    const { setAuthUser, authUser } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        await axios.post(`${API_SERVER}/auth/logout`, {}, { withCredentials: true });
        setAuthUser(null);
        navigate('/sign-in');
    };
    useEffect(() => {
        const currentUrl = window.location.href;
        if (currentUrl.indexOf('my-profile') > -1) {
            document.querySelector('div.default-header').classList.remove('closed');
            document.querySelectorAll('.list-group-item').forEach(div => {
                div.classList.add("opened");
                div.querySelector('p').style.display = 'block';

            });
        }else{
            document.querySelectorAll('.logo-container').forEach(div => {
                div.querySelector('.row').querySelectorAll('p').forEach(div => {
                    div.style.display = 'none';
                });
            });
        }
        // document.querySelector('.dropdown-container').addEventListener('click', function() {
        //     document.querySelector('#secondElement').click();
        // });
    }, []);
    return (
        <div className='default-header d-flex flex-column closed'>
            <Container className='logo-container w-100 d-flex align-items-center'>
                <a className='d-flex flex-row' href="/" style={{textDecoration: 'none', fontFamily: 'Russo One', color: 'black'}}>
                    <Image
                        src={Logo}
                        className='logo'
                        alt='Logo'
                        width={37.5}
                        height={51}
                    />
                    <Row>
                        <p style={{fontSize: '28px', height: '28px', letterSpacing: '4px', display: 'flex', alignItems: 'center'}}>SKILL</p>
                        <p style={{height: '19px', display: 'flex', display: 'flex', alignItems: 'center'}}>SHUFFLE</p>
                    </Row>
                </a>
            </Container>
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
                            <p>Profile</p>
                        </ListGroup.Item>
                        <ListGroup.Item className='dropdown-container'>
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