import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

function Content({ isAuthenticated, setIsAuthenticated }) {
    return (
        <Container className='wrapper'>
            <Routes>
                <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/sign-in" />} />

                {/* Authentication routes */}
                <Route path="/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/sign-up" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />

                {/* Redirect to sign-in page if no route matches */}
                <Route path="/" element={<Navigate to="/sign-in" />} />
            </Routes>
        </Container>
    )
}

export default Content;
