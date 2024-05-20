import React, { useEffect, useState } from 'react';

import { useAuth } from '../components/AuthContext';
import ProfileAside from '../components/ProfileAside';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import { API_SERVER } from '../config';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

function UserInteractions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [user, setUser] = useState(null);
    const [showAside, setShowAside] = useState(false);
    const { authUser } = useAuth();

    useEffect(() => {
        // Close header
        document.querySelector('.header').classList.remove('closed');
    }, [authUser.nickname]);

    useEffect(() => {
        handleResize();
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
            if (windowDimensions.width > 1400 || windowDimensions.width <= 1000) {
                setShowAside(false);
            } else {
                setShowAside(true);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions.width]);

    return (
        <div className="wrapper-user-interactions pb-5">
            {user && (
                
            )}
        </div>
    )
}

export default UserInteractions;