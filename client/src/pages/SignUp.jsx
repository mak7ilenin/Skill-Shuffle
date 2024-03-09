import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();
    
    const register = async (e) => {
        e.preventDefault();
        const body = {
            first_name: "Test " + username,
            last_name: "The " + nickname,
            username: username,
            password: password,
            nickname: nickname,
            email: email,
            gender: "other",
            birth_date: "2004-12-22",
            bio: "Test " + username,
            avatar_url: ""
        };
        try {
            await axios.post('http://localhost:8080/api/auth/sign-up', body)
                .then(() => {
                    navigate('/sign-in');
                });
        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message);
            }
        }
    };

    return (
        <Container className='d-flex justify-content-center align-items-center'>
            <Form onSubmit={register}>
                <Form.Group controlId='formBasicUsername'>
                    <Form.Control type='text' name='username' placeholder='Username' 
                        onChange={e => setUsername(e.target.value)} autoComplete='username' />
                </Form.Group>

                <Form.Group controlId='formBasicEmail'>
                    <Form.Control type='email' name='email' placeholder='E-mail' 
                        onChange={e => setEmail(e.target.value)} autoComplete='email' />
                </Form.Group>

                <Form.Group controlId='formBasicNickname'>
                    <Form.Control type='text' name='nickname' placeholder='Nickname' 
                        onChange={e => setNickname(e.target.value)} autoComplete='nickname' />
                </Form.Group>

                <Form.Group controlId='formBasicPassword'>
                    <Form.Control type='password' name='password' placeholder='Password' 
                    onChange={e => setPassword(e.target.value)} autoComplete='password' />
                </Form.Group>

                <Button variant='primary' type='submit'>
                    Sign Up
                </Button>

                <Form.Text className='text-muted'>
                    Already have an account? <Link to='/sign-in'>Sign In</Link>
                </Form.Text>
            </Form>
        </Container>
    )
}

export default SignUp