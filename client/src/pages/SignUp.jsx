import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoArrowLeft } from "react-icons/go";

import { API_SERVER } from '../config';
import SignUpSteps from '../components/SignUpSteps';

import { ReactComponent as Logo } from '../assets/icons/logo.svg';

function SignUp() {
    const [showArrow, setShowArrow] = useState(false);
    const [successfullRegistration, setSuccessfullRegistration] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // [1, 2, 3, 4, 5, 6, 7]
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const register = (formData) => {
        axios.post(`${API_SERVER}/auth/register`, formData,
            {
                withCredentials: false,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                setSuccessfullRegistration(true);
                changeStep(7);
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
            case 7:
                return 'Congratulations! Your account has been successfully created'
            default:
                return 'Enter your name';
        };
    };

    const changeStep = useCallback(step => {
        if (step > 1 && step <= 7) {
            navigate(`/sign-up?step=${step}`)
            setCurrentStep(step);
            setShowArrow(true);
        } else {
            navigate('/sign-up');
            setCurrentStep(1);
            setShowArrow(false);
        }
        if (step === 7 && successfullRegistration) {
            navigate(`/sign-up?step=${step}`)
            setShowArrow(false);
            setCurrentStep(step);
        }
        setTitle(getStepTitle(step));
    }, [navigate, successfullRegistration]);

    const toPrevoisStep = () => {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        changeStep(prevStep);

        if (prevStep === 1) {
            navigate(`/sign-up`);
        } else {
            navigate(`/sign-up?step=${prevStep}`);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let step = parseInt(urlParams.get('step')) || 1;
        changeStep(step);
    }, [changeStep]);

    return (
        <Container className='sign-up d-flex flex-column justify-content-center align-items-center'>
            <div className="sign-up__container">
                {showArrow && (
                    <Button
                        variant='none'
                        className='arrow-back'
                        onClick={toPrevoisStep}
                    >
                        <GoArrowLeft
                            className='arrow-icon'
                            size={25}
                            strokeWidth={0.5}
                        />
                    </Button>
                )}
                <Row className='logo-container'>
                    <Logo height={90} />
                </Row>
                <Row className='sign-up__title mt-3 mb-4'>
                    <h2 className='text-uppercase text-center'>Sign up</h2>
                    <hr className='w-50 mb-1 mx-auto' />
                    <p className='text-muted text-center'>{title}</p>
                </Row>

                <SignUpSteps
                    register={register}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    changeStep={changeStep}
                />
            </div>
        </Container>
    )
}

export default SignUp