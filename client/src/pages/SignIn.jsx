import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_SERVER } from '../config';

function SignIn({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_SERVER}/auth/login`, { username, password }, { withCredentials: true })
                .then(response => {
                    const resposeData = response.data;
                    const authUser = {
                        'nickname': resposeData.nickname,
                        'first_name': resposeData.first_name,
                        'avatar': resposeData.avatar_url === '' ? null : resposeData.avatar_url
                    };
                    sessionStorage.setItem('auth-user', JSON.stringify(authUser));
                    setIsAuthenticated(true);
                    navigate('/chat');
                });
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message);
            }
        }
    }

    return (
        <Container className='d-flex justify-content-center align-items-center'>
            <Form onSubmit={login}>
                <Form.Group controlId='formBasicUsername'>
                    <Form.Control type='text' name='username' placeholder='Username'
                        onChange={e => setUsername(e.target.value)} autoComplete='username' />
                </Form.Group>

                <Form.Group controlId='formBasicPassword'>
                    <Form.Control type='password' name='password' placeholder='Password'
                        onChange={e => setPassword(e.target.value)} autoComplete='current-password' />
                </Form.Group>

                <Button variant='primary' type='submit'>
                    Sign In
                </Button>

                <Form.Text className='text-muted'>
                    Don't have an account? <Link to='/sign-up'>Sign Up</Link>
                </Form.Text>
            </Form>
        </Container>
    )
}

export default SignIn