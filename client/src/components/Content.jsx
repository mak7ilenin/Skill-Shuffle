import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import Error from '../pages/Error';
import { useAuth } from './AuthContext';

function Content() {
    const { authUser } = useAuth();

    return (
        <div className='wrapper'>
            <Routes>
                {authUser ? (
                    <Route path="/messenger" element={<Chat />} />
                ) : (
                    <Route path="/messenger" element={<Navigate to="/sign-in" />} />
                )}

                {authUser ? (
                    <Route path="/me" element={<Profile />} />
                ) : (
                    <Route path="/me" element={<Navigate to="/sign-in" />} />
                )}

                {/* Authorization routes */}
                <Route path="/sign-in" element={authUser ? <Navigate to="/me" /> : <SignIn />} />
                <Route path="/sign-up" element={authUser ? <Navigate to="/me" /> : <SignUp />} />

                {/* Default route */}
                <Route path="/" element={authUser ? <Navigate to="/me" /> : <Navigate to="/sign-in" />} />

                {/* Invalid route - send to error page */}
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    )
}

export default Content;
