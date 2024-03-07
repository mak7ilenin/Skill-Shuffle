import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

import Logo from '../assets/logo.svg';

function Header() {
    return (
        <div className='default-header closed'>
            <Container className='logo-container'>
                <img src={Logo} className='logo' alt='Logo' />
            </Container>
            <ListGroup>
                <ListGroup.Item>Home</ListGroup.Item>
                <ListGroup.Item>Search</ListGroup.Item>
                <ListGroup.Item>Chats</ListGroup.Item>
                <ListGroup.Item>Notifif</ListGroup.Item>
                <ListGroup.Item>Create</ListGroup.Item>
                <ListGroup.Item>Profile</ListGroup.Item>
            </ListGroup>
        </div>
    )
}

export default Header;