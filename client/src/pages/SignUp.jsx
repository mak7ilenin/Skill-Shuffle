import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import SignUpSteps from '../components/SignUpSteps';

import { ReactComponent as Logo } from '../assets/icons/logo.svg';

function SignUp() {
    const [formData, setFormData] = useState(new FormData());
    const [title, setTitle] = useState('Enter your name');
    const navigate = useNavigate();

    const register = () => {
        axios.post(`${API_SERVER}/auth/register`, formData)
            .then(() => {
                navigate('/sign-in');
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data.message);
                }
            });
    };


    return (
        <Container className='sign-up d-flex flex-column justify-content-center align-items-center'>
            <div className="sign-up__container">
                <Row className='logo-container'>
                    <Logo height={90} />
                </Row>
                <Row className='sign-up__title mt-3 mb-4'>
                    <h2 className='text-uppercase text-center'>Sign up</h2>
                    <hr className='w-25 my-0 mx-auto' />
                    <p className='text-muted text-center'>{title}</p>
                </Row>
                <SignUpSteps setFormData={setFormData} register={register} setTitle={setTitle} />
            </div>
        </Container>
    )
}

export default SignUp