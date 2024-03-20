import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_SERVER } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('auth-user'));
    });

    useEffect(() => {
        // Check user's authentication status with refresh token
        if (!authUser) {
            axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
                .then(response => {
                    if (response.status === 200) {
                        setAuthUser(response.data.user);
                    }
                })
                .catch(() => {
                    setAuthUser(null);
                });
        }
    }, [authUser]);

    useEffect(() => {
        // Store authUser in sessionStorage whenever it changes
        if (authUser) {
            sessionStorage.setItem('auth-user', JSON.stringify(authUser));
        } else {
            sessionStorage.removeItem('auth-user');
        }
    }, [authUser]);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
