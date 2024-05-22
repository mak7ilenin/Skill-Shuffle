import React, { useEffect, useState } from 'react';
import { Form, InputGroup, Button, FloatingLabel, Image, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import AddAvatarIcon from '../assets/images/add-avatar.png';

function SignUpSteps({ register, currentStep, setCurrentStep, changeStep, error, setError }) {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState({});

    const [avatarBlob, setAvatarBlob] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bio, setBio] = useState('');

    const [nickname, setNickname] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png']
        },
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onload = () => {
                setAvatarBlob(file);
                setAvatarUrl(reader.result);
            };

            reader.readAsDataURL(file);
        }
    });

    const submitForm = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (validateFormSubmitting()) {
            const formattedBirthDate = new Date(birthDate.year, birthDate.month - 1, birthDate.day);
            const user = {
                firstName,
                lastName,
                gender,
                birthDate: formattedBirthDate,
                bio: !bio ? null : bio,
                nickname,
                username,
                email: !email ? null : email,
                password
            };

            const formData = new FormData();
            if (avatarBlob) {
                formData.append('avatarBlob', avatarBlob);
            }
            formData.append('user', JSON.stringify(user));

            register(formData);
        };

        return;
    };

    const validateFormSubmitting = () => {
        // Validate current step
        if (!validateCurrentStep()) return;

        // Check required fields
        if (!firstName || !lastName || !gender || !birthDate.day || !birthDate.month
            || !birthDate.year || !nickname || !username || !password) {

            setError('Please fill required fields');
            if (!firstName || !lastName) {
                changeStep(1);
            } else if (!gender || !birthDate.day || !birthDate.month || !birthDate.year) {
                changeStep(2);
            } else if (!nickname) {
                changeStep(4);
            } else if (!username) {
                changeStep(5);
            }
            return false;
        }

        return true;
    };

    const markInvalidFields = (invalidFields) => {
        invalidFields.forEach(field => {
            const input = document.querySelector(`[name=${field}]`);
            if (input) input.classList.add('invalid');

            const select = document.querySelector(`[name=${field}]`);
            if (select) select.classList.add('invalid');
        });
    };

    const validateCurrentStep = () => {
        const invalidFields = [];
        setError('');
        document.querySelectorAll('.form-control').forEach(el => {
            el.classList.remove('invalid');
        });
        document.querySelectorAll('.form-select').forEach(el => {
            el.classList.remove('invalid');
        });

        switch (currentStep) {
            case 1:
                if (!firstName || !lastName) {
                    if (!firstName) invalidFields.push('firstName');
                    if (!lastName) invalidFields.push('lastName');
                    markInvalidFields(invalidFields);
                    setError('Please fill required fields');
                    return false;
                }
                return true;
            case 2:
                if (!gender) invalidFields.push('gender');
                if (!birthDate.day) invalidFields.push('day');
                if (!birthDate.month) invalidFields.push('month');
                if (!birthDate.year) invalidFields.push('year');
                if (invalidFields.length !== 0) {
                    markInvalidFields(invalidFields);
                    setError('Please fill required fields');
                    return false;
                }
                return true;
            case 3:
                return true;
            case 4:
                if (!nickname) {
                    invalidFields.push('nickname');
                    markInvalidFields(invalidFields);
                    setError('Please fill required fields');
                    return false;
                }
                return true;
            case 5:
                if (!username) {
                    invalidFields.push('username');
                    markInvalidFields(invalidFields);
                    setError('Please fill required fields');
                    return false;
                }
                if (email) {
                    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                    if (!emailPattern.test(email)) {
                        invalidFields.push('email');
                        markInvalidFields(invalidFields);
                        setError('Invalid e-mail format');
                        return false;
                    }
                }

                return true;
            case 6:
                if (!password || !confirmPassword) {
                    if (!password) invalidFields.push('password');
                    if (!confirmPassword) invalidFields.push('confirmPassword');
                    markInvalidFields(invalidFields);
                    setError('Please fill required fields');
                    return false;
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                return true;
            default:
                return false;
        }
    };

    const checkForNativeErrors = (e) => {
        // Prevent from form submitting
        e.preventDefault();
        e.stopPropagation();

        if (validateCurrentStep()) {
            nextStep();
            return;
        }
    };

    const nextStep = () => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        changeStep(nextStep);
    }

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    useEffect(() => {
        setCurrentStep(currentStep);
    }, [currentStep, setCurrentStep]);

    useEffect(() => {
        if (error) {
            setError(error);
        }
    }, [error, setError]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let step = parseInt(urlParams.get('step')) || 1;
        setCurrentStep(step);
    }, [setCurrentStep]);

    return (
        <Form className='sign-up__form' >
            {currentStep < 7 && (
                <div className="d-flex flex-column gap-2">
                    {currentStep === 1 && (
                        <>
                            <FloatingLabel controlId='floatingFirstName' label='First name'>
                                <Form.Control
                                    type='text'
                                    name='firstName'
                                    onChange={e => setFirstName(e.target.value)}
                                    value={firstName}
                                    placeholder='First name'
                                    autoComplete='firstName'
                                    required
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId='floatingLastName' label='Last name'>
                                <Form.Control
                                    type='text'
                                    name='lastName'
                                    placeholder='Last name'
                                    onChange={e => setLastName(e.target.value)}
                                    value={lastName}
                                    autoComplete='lastName'
                                    required
                                />
                            </FloatingLabel>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <FloatingLabel controlId='floatingGender' label='Gender'>
                                <Form.Select name='gender' onChange={e => setGender(e.target.value)} defaultValue={gender || ''} required>
                                    <option className='default' value={''}>Choose your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                            </FloatingLabel>

                            {/* Birthday Date Selection */}
                            <Form.Group className='d-flex justify-content-between gap-2' controlId='formBirthDate'>

                                {/* Year Selection */}
                                <FloatingLabel controlId='floatingYear' label='Year'>
                                    <Form.Select
                                        name='year'
                                        defaultValue={birthDate.year || ''}
                                        onChange={e => setBirthDate(prevState => ({ ...prevState, year: e.target.value }))}
                                        required
                                    >
                                        <option className='default' value={''}>Year</option>

                                        {/* Year list (100 options) 14 years is the min age */}
                                        {Array.from({ length: 100 }, (_, index) => (
                                            <option key={index + 1} value={new Date().getFullYear() - index - 14}>{new Date().getFullYear() - index - 14}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>

                                {/* Month Selection */}
                                <FloatingLabel controlId='floatingMonth' label='Month'>
                                    <Form.Select
                                        name='month'
                                        defaultValue={birthDate.month || ''}
                                        onChange={e => setBirthDate(prevState => ({ ...prevState, month: e.target.value }))}
                                        required
                                    >
                                        <option className='default' value={''}>Month</option>

                                        {/* Month list */}
                                        {Array.from({ length: 12 }, (_, index) => (
                                            <option key={index + 1} value={index + 1}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>

                                {/* Day Selection */}
                                <FloatingLabel controlId='floatingDay' label='Day'>
                                    <Form.Select
                                        name='day'
                                        defaultValue={birthDate.day || ''}
                                        onChange={e => setBirthDate(prevState => ({ ...prevState, day: e.target.value }))}
                                        disabled={!birthDate.month || !birthDate.year}
                                        required
                                    >
                                        <option className='default' value={''}>Day</option>

                                        {/* Available days based on month */}
                                        {birthDate.month && birthDate.year && Array.from({ length: daysInMonth(birthDate.month, birthDate.year) }, (_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>

                            </Form.Group>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <Form.Group controlId='formAvatar'>
                                <Row className="avatar-container w-100 d-flex align-items-center mb-2" {...getRootProps()}>
                                    <input {...getInputProps()} />

                                    <Col className="left-column pe-4">
                                        <div className="avatar-decoration">Upload</div>
                                    </Col>

                                    <Col className="mid-column">
                                        {avatarUrl ? (
                                            <Image
                                                src={avatarUrl}
                                                width={120}
                                                height={120}
                                                className='object-fit-cover'
                                                roundedCircle
                                            />
                                        ) : (
                                            <Image src={AddAvatarIcon} width={120} />
                                        )}
                                    </Col>

                                    <Col className="right-column ps-4">
                                        <div className="avatar-decoration">Image</div>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <FloatingLabel controlId='floatingBio' label='Biography (optional)'>
                                <Form.Control
                                    as='textarea'
                                    name='bio'
                                    onChange={e => setBio(e.target.value)}
                                    value={bio}
                                    maxLength={275}
                                    placeholder='Biography (optional)'
                                    autoComplete='bio'
                                />
                            </FloatingLabel>
                        </>
                    )}
                    {currentStep === 4 && (
                        <InputGroup>
                            <InputGroup.Text id="at-addon">@</InputGroup.Text>
                            <Form.Control
                                name='nickname'
                                placeholder="Nickname"
                                aria-label="Nickname"
                                aria-describedby="at-addon"
                                value={nickname}
                                onChange={e => {
                                    const validPattern = /^[a-zA-Z0-9_-]*$/;
                                    if (validPattern.test(e.target.value)) {
                                        setNickname(e.target.value.toLowerCase())
                                    }
                                }}
                            />
                        </InputGroup>
                    )}
                    {currentStep === 5 && (
                        <>
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

                            <FloatingLabel controlId='floatingEmail' label='E-mail (optional)'>
                                <Form.Control
                                    type='email'
                                    name='email'
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                    placeholder='E-mail (optional)'
                                    autoComplete='email'
                                />
                            </FloatingLabel>
                        </>
                    )}
                    {currentStep === 6 && (
                        <>
                            <InputGroup className='position-relative'>
                                <FloatingLabel controlId='floatingPassword' label='Password'>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        onChange={e => setPassword(e.target.value)}
                                        value={password}
                                        placeholder='Password'
                                        autoComplete='new-password'
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

                            <InputGroup className='position-relative'>
                                <FloatingLabel controlId='floatingConfirmPassword' label='Confirm password'>
                                    <Form.Control
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name='confirmPassword'
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        placeholder='Confirm password'
                                        autoComplete='new-password'
                                        required
                                    />
                                    <Button
                                        variant='light'
                                        className='show-password position-absolute end-0 top-0 h-100 border border-start-0 rounded-start-0'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </FloatingLabel>
                            </InputGroup>
                        </>
                    )}
                </div>
            )}

            {error && (
                <Form.Group className='w-100 d-flex align-content-center my-2'>
                    <Form.Text className='error-message w-100 text-center m-0'>
                        {error}
                    </Form.Text>
                </Form.Group>
            )}

            <Form.Group className={`buttons-group w-100 d-flex gap-2 ${error ? 'mt-0' : 'mt-3'}`}>
                {currentStep === 3 && (
                    <Button variant='secondary' type='button' className='skip-btn' onClick={nextStep}>
                        <span>Skip</span>
                    </Button>
                )}
                {currentStep === 6 && (
                    <Button variant='primary' type='submit' className='next-btn' onClick={submitForm}>
                        <span>Register</span>
                    </Button>
                )}
                {currentStep === 7 && (
                    <Button variant='primary' type='button' className='next-btn' onClick={() => navigate('/sign-in')}>
                        <span>Login</span>
                    </Button>
                )}
                {currentStep < 6 && (
                    <Button variant='primary' type='submit' className='next-btn' onClick={checkForNativeErrors}>
                        <span>Next</span>
                    </Button>
                )}
            </Form.Group>

            {currentStep < 7 && (
                <>
                    <hr className='mt-3 mb-0' />
                    <Form.Group className='w-100 d-flex justify-content-center align-items-center'>
                        <Form.Text>
                            Already have an account? <Link to='/sign-in'>Sign in</Link>
                        </Form.Text>
                    </Form.Group>
                </>
            )}
        </Form>
    )
}

export default SignUpSteps