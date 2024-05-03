import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_SERVER } from '../config';
import SignUpSteps from '../components/SignUpSteps';

import { ReactComponent as Logo } from '../assets/icons/logo.svg';

function SignUp() {
    const [showArrow, setShowArrow] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [currentStep, setCurrentStep] = useState(1); // [1, 2, 3, 4, 5, 6]
    const [title, setTitle] = useState('');
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

    const getStepTitle = (step) => {
        switch (step) {
            case 1:
                return 'Enter your name';
            case 2:
                return 'Enter your birthday and gender';
            case 3:
                return 'Add your biography and avatar';
            case 4:
                return 'Enter your short name so that others can easily find you or mention you in posts';
            case 5:
                return 'Enter your username and e-mail';
            case 6:
                return 'Create a strong password with a mix of letters, numbers and symbols'
            default:
                return 'Enter your name';
        };
    };

    const changeStep = useCallback((step) => {
        if (step > 1) {
            navigate(`/sign-up?step=${step}`)
        }
        setCurrentStep(step);
        setTitle(getStepTitle(step));
        step > 1 && step <= 6 ? setShowArrow(true) : setShowArrow(false);
    }, [navigate]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let step = urlParams.get('step');
        !step && (step = 1);
        changeStep(parseInt(step));
    }, [changeStep, currentStep]); // Include currentStep in the dependency array

    return (
        <Container className='sign-up d-flex flex-column justify-content-center align-items-center'>
            {showArrow && (
                <i
                    className='fas fa-arrow-left fa-2x text-primary position-absolute top-0 start-0 m-3'
                    onClick={() => navigate('/sign-up')}
                />
            )}
            <div className="sign-up__container">
                <Row className='logo-container'>
                    <Logo height={90} />
                </Row>
                <Row className='sign-up__title mt-3 mb-4'>
                    <h2 className='text-uppercase text-center'>Sign up</h2>
                    <hr className='w-25 my-0 mx-auto' />
                    <p className='text-muted text-center'>{title}</p>
                </Row>

                <SignUpSteps
                    setFormData={setFormData}
                    register={register}
                    currentStep={currentStep}
                    changeStep={changeStep}
                />
            </div>
        </Container>
    )
}

export default SignUp