import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

function Content() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('auth-user') !== '' && sessionStorage.getItem('auth-user') !== null;
    });

    return (
        <Container className='wrapper'>
            <Routes>
                {/* Route for Sign In */}
                <Route path="/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />

                {/* Route for Sign Up */}
                <Route path="/sign-up" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
                
                {/* Route for Chat (only accessible when authenticated) */}
                <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/sign-in" />} />

                {/* Redirect non-authorized users to sign-in when on other pages */}
                <Route path="/" element={<Navigate to="/sign-in" />} />
            </Routes>
        </Container>
    )
}

export default Content;
