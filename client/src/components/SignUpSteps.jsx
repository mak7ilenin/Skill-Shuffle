import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

function SignUpSteps({ setFormData, register, currentStep, changeStep }) {
    const [error, setError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [avatarBlob, setAvatarBlob] = useState('');
    const [bio, setBio] = useState('');

    const [nickname, setNickname] = useState('');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const submitForm = () => {
        setFormData(formData => {
            formData.set('firstName', firstName); // required
            formData.set('lastName', lastName); // required
            formData.set('gender', gender); // required
            formData.set('birthDate', birthDate); // required
            formData.set('avatarBlob', avatarBlob);
            formData.set('bio', bio);
            formData.set('nickname', nickname); // required
            formData.set('username', username); // required
            formData.set('email', email);
            formData.set('password', password); // required
        });
    };

    const validateFormSubmiting = () => {
        // Check required fields
        if (!firstName || !lastName || !gender || !birthDate || !nickname || !username || !password) {
            setError('Please fill required fields');
            return false;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const checkForNativeErrors = (e) => {
        // Prevent from form submiting
        e.preventDefault();
        e.stopPropagation();

        const form = e.target.form;
        if (form && !form.checkValidity()) {
            form.classList.add('was-validated');
        } else {
            form.classList.remove('was-validated');
            changeStep(currentStep + 1);
        }
    };

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    return (
        <Form className='sign-up__form' >
            {currentStep === 1 && (
                <>
                    <Form.Group className='field-container' controlId='formFirstName'>
                        <Form.Control type='text' name='firstName' placeholder='First name'
                            onChange={e => setFirstName(e.target.value)} autoComplete='firstName' required />
                    </Form.Group>

                    <Form.Group className='field-container' controlId='formLastName'>
                        <Form.Control type='text' name='lastName' placeholder='Last name'
                            onChange={e => setLastName(e.target.value)} autoComplete='lastName' required />
                    </Form.Group>
                </>
            )}
            {currentStep === 2 && (
                <>
                    <Form.Group className='field-container' controlId='formGender'>
                        <Form.Select name='gender' onChange={e => setGender(e.target.value)} required>
                            <option className='default' defaultValue={null}>Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Birthday Date Selection */}
                    <Form.Group className='field-container d-flex justify-content-between gap-2' controlId='formBirthDate'>
                        {/* Day Selection */}
                        <Form.Select name='day' onChange={e => setBirthDate(prevState => ({ ...prevState, day: e.target.value }))} required disabled={!birthDate.month || !birthDate.year}>
                            <option className='default' defaultValue={null}>Day</option>
                            {/* Generate options for days based on selected month and year */}
                            {birthDate.month && birthDate.year && Array.from({ length: daysInMonth(birthDate.month, birthDate.year) }, (_, index) => (
                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                            ))}
                        </Form.Select>
                        {/* Month Selection */}
                        <Form.Select name='month' onChange={e => setBirthDate(prevState => ({ ...prevState, month: e.target.value }))} required>
                            <option className='default' defaultValue={null}>Month</option>
                            {/* Generate options for months */}
                            {Array.from({ length: 12 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </Form.Select>
                        {/* Year Selection */}
                        <Form.Select name='year' onChange={e => setBirthDate(prevState => ({ ...prevState, year: e.target.value }))} required>
                            <option className='default' defaultValue={null}>Year</option>
                            {/* Generate options for years (current year - 14) to (current year - 100) */}
                            {Array.from({ length: 100 }, (_, index) => (
                                <option key={index + 1} value={new Date().getFullYear() - index - 14}>{new Date().getFullYear() - index - 14}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </>
            )}

            <Form.Group className='mt-3 w-100'>
                <Button variant='primary' type='link' className='next-btn w-100' onClick={checkForNativeErrors}>
                    <span>Next</span>
                </Button>
            </Form.Group>

            <hr className='mt-3 mb-0' />
            <Form.Group className='w-100 d-flex justify-content-center align-items-center'>
                <Form.Text>
                    Already have an account? <Link to='/sign-in'>Sign in</Link>
                </Form.Text>
            </Form.Group>
        </Form>
    )
}

export default SignUpSteps