import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

function SignUpSteps({ setFormData, register, setTitle }) {
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

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

    const validateForm = () => {
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

    const getStepTitle = (step) => {
        switch (step) {
            case '1':
                return 'Enter your name';
            case '2':
                return 'Enter your birthday and gender';
            case '3':
                return 'Add your biography and avatar';
            case '4':
                return 'Enter your short name so that others can easily find you or mention you in posts';
            case '5':
                return 'Enter your username and e-mail';
            case '6':
                return 'Create a strong password with a mix of letters, numbers and symbols'
            default:
                return 'Enter your name';
        };
    };

    const checkForNativeErrors = (e) => {
        const form = e.target.form;
        // Loop over them and prevent submission
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
            setCurrentStep(currentStep + 1);
            window.history.pushState({}, '', `/sign-up?step=${currentStep + 1}`);
        }, false)
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const step = urlParams.get('step');
        setTitle(getStepTitle(step));
        setCurrentStep(Number(step));
    }, [setTitle]);

    return (
        // href='/sign-up?step=2'
        <Form className='sign-up__form'>
            <Form.Group controlId='formFirstName'>
                <Form.Control type='text' name='firstName' placeholder='First name'
                    onChange={e => setFirstName(e.target.value)} autoComplete='firstName' required />
            </Form.Group>

            <Form.Group controlId='formLastName'>
                <Form.Control type='lastName' name='lastName' placeholder='Last name'
                    onChange={e => setLastName(e.target.value)} autoComplete='lastName' required />
            </Form.Group>

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