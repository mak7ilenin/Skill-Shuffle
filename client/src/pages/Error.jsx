import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Container, Button } from 'react-bootstrap';

import { ReactComponent as Logo } from '../assets/icons/logo.svg';

function Error() {
    return (
        <Container className='error-page'>
            <Row className='error-page__container'>
                <Col className='error-page__left-column align-self-center'>
                    <h1>404</h1>
                </Col>
                <Col className='error-page__separator h-100'/>
                <Col className='error-page__right-column'>
                    <NavLink href='/' role='button' className="error-page__logo-container">
                        <div className='error-page__logo-icon'>
                            <Logo width={45} height={61} />
                        </div>
                        <div className='error-page__logo-text ms-2'>
                            <p>SKILL</p>
                            <p>SHUFFLE</p>
                        </div>
                    </NavLink>
                    <h2>Sorry, this page isn't available!</h2>
                    <Button role='link' href='/' variant='primary' className='error-page__button'>
                        Visit home page
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Error