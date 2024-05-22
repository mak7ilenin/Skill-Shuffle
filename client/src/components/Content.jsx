import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Chat from '../pages/Chat';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import UserProfile from '../pages/UserProfile';
import UserInteractions from '../pages/UserInteractions';
import Error from '../pages/Error';
import { useAuth } from './AuthContext';

function Content() {
    const { authUser } = useAuth();

    return (
        <div className='wrapper'>
            <Routes>
                <Route path="/messenger" element={authUser ? <Chat /> : <Navigate to="/sign-in" />} />

                <Route path="/me" element={authUser ? <Profile /> : <Navigate to="/sign-in" />} />

                <Route path="/users" element={authUser ? <UserProfile /> : <Navigate to="/sign-in" />} />

                {/* User interactions routes */}
                {['friends', 'followers'].map(path =>
                    <Route
                        key={path}
                        path={path}
                        element={authUser ? <UserInteractions /> : <Navigate to="/sign-in" />}
                    />
                )}

                {/* Authorization routes */}
                <Route path="/sign-in" element={authUser ? <Navigate to="/me" /> : <SignIn />} />
                <Route path="/sign-up" element={authUser ? <Navigate to="/me" /> : <SignUp />} />

                {/* Ignore ADMIN_PATH to avoid interference */}
                <Route path={`${process.env.REACT_APP_ADMIN_PATH}/*`} element={<div />} />

                {/* Default route */}
                <Route path="/" element={authUser ? <Navigate to="/me" /> : <Navigate to="/sign-in" />} />

                {/* Invalid route - send to error page */}
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    )
}

export default Content;
