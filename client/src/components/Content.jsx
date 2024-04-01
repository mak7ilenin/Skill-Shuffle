import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { useAuth } from './AuthContext';
import Profile from '../pages/Profile';

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
                    <Route path="/my-profile" element={<Profile />} />
                ) : (
                    <Route path="/my-profile" element={<Navigate to="/sign-in" />} />
                )}
                <Route path="/sign-in"
                    element={
                        // If user is authenticated, redirect to the Chat page
                        authUser ? <Navigate to="/my-profile" /> : <SignIn />
                    }
                />
                <Route path="/sign-up"
                    element={
                        // If user is authenticated, redirect to the Chat page
                        authUser ? <Navigate to="/my-profile" /> : <SignUp />
                    }
                />

                <Route path="/"
                    element={
                        // If user is authenticated, redirect to the Chat page otherwise redirect to the sign-in page
                        authUser ? <Navigate to="/my-profile" /> : <Navigate to="/sign-in" />
                    }
                />
            </Routes>
        </div>
    )
}

export default Content;
