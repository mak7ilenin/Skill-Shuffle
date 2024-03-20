import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { useAuth } from './AuthContext';

function Content() {
    const { authUser } = useAuth();

    return (
        <Container className='wrapper'>
            <Routes>
                {authUser ? (
                    <Route path="/messenger" element={<Chat />} />
                ) : (
                    <Route path="/messenger" element={<Navigate to="/sign-in" />} />
                )}

                <Route path="/sign-in"
                    element={
                        // If user is authenticated, redirect to the Chat page
                        authUser ? <Navigate to="/messenger" /> : <SignIn />
                    }
                />
                <Route path="/sign-up"
                    element={
                        // If user is authenticated, redirect to the Chat page
                        authUser ? <Navigate to="/messenger" /> : <SignUp />
                    }
                />

                <Route path="/"
                    element={
                        // If user is authenticated, redirect to the Chat page otherwise redirect to the sign-in page
                        authUser ? <Navigate to="/messenger" /> : <Navigate to="/sign-in" />
                    }
                />
            </Routes>
        </Container>
    )
}

export default Content;
