import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER, SERVER_URL } from '../config';
import { useAuth } from './AuthContext';

import Logo from '../assets/logo.svg';
import imagePlaceholder from '../assets/image-placeholder.svg';

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
        <div className='default-header closed'>
            <Container className='logo-container'>
                <img src={Logo} className='logo' alt='Logo' />
            </Container>
            <ListGroup>
                <ListGroup.Item>Home</ListGroup.Item>
                <ListGroup.Item>Search</ListGroup.Item>
                <ListGroup.Item>Chats</ListGroup.Item>
                <ListGroup.Item>Notific</ListGroup.Item>
                <ListGroup.Item>Create</ListGroup.Item>
                {authUser ? (
                    <ListGroup.Item>
                        <div className='avatar-container'>
                            <img 
                                src={authUser.avatar !== null ? `${SERVER_URL}/${authUser.avatar}` : imagePlaceholder} 
                                width={30}
                                height={30}
                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                className='avatar' 
                                alt='Avatar' 
                            />
                            <span>{authUser.nickname}</span>
                        </div>
                    </ListGroup.Item>
                ) : null}
                {authUser ? (<ListGroup.Item onClick={logout} style={{cursor: 'pointer'}}>Sign-out</ListGroup.Item>) : null}
            </ListGroup>
        </div>
    )
}

export default Header;