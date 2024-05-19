import React, { useState } from 'react';
import { Container, Form, InputGroup, Button, FloatingLabel, Row } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import { API_SERVER } from '../config';

import { ReactComponent as Logo } from '../assets/icons/logo.svg';

function SignIn() {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        await axios.post(`${API_SERVER}/auth/login`, { username, password, rememberMe }, { withCredentials: true })
            .then(response => {
                setAuthUser(response.data.user);
                navigate('/me');
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data);
                    setPassword('');
                }
            });
    }

    return (

        <Container className='sign-in d-flex flex-column justify-content-center align-items-center'>
            <div className="form-container">
                <Row className='logo-container'>
                    <Logo height={90} />
                </Row>

                <Row className='form-container__title mt-3 mb-4'>
                    <h2 className='text-uppercase text-center'>Sign in</h2>
                </Row>

                <Form className='sign-in__form' onSubmit={login}>
                    <div className="d-flex flex-column gap-2">
                        <FloatingLabel controlId='floatingUsername' label='Username'>
                            <Form.Control
                                type='text'
                                name='username'
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                placeholder='Username'
                                autoComplete='username'
                                required
                            />
                        </FloatingLabel>

                        <InputGroup className='position-relative'>
                            <FloatingLabel controlId='floatingPassword' label='Password'>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    placeholder='Password'
                                    autoComplete='password'
                                    required
                                />
                                <Button
                                    variant='light'
                                    className='show-password position-absolute end-0 top-0 h-100 border border-start-0 rounded-start-0'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </FloatingLabel>
                        </InputGroup>

                        <Form.Group className={`${error ? 'mb-0' : 'mb-3'}`} controlId="formRememberMeCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Remember me"
                                onChange={e => setRememberMe(e.target.checked)}
                                checked={rememberMe}
                            />
                        </Form.Group>
                    </div>

                    {error && (
                        <Form.Group className='w-100 d-flex align-content-center my-2'>
                            <Form.Text className='error-message w-100 text-center m-0'>
                                {error}
                            </Form.Text>
                        </Form.Group>
                    )}

                    <Form.Group className='w-100 d-flex'>
                        <Button variant='primary' type='submit' className='submit-btn'>
                            <span>Login</span>
                        </Button>
                    </Form.Group>

                    <hr className='mt-3 mb-0' />
                    <Form.Group className='w-100 d-flex justify-content-center align-items-center'>
                        <Form.Text>
                            Don't have an account? <Link to='/sign-up'>Sign Up</Link>
                        </Form.Text>
                    </Form.Group>
                </Form>
            </div>
        </Container>
    )
}

export default SignIn