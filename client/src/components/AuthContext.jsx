import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        const storedUser = sessionStorage.getItem('auth-user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        // Store authUser in sessionStorage whenever it changes
        sessionStorage.setItem('auth-user', JSON.stringify(authUser));
    }, [authUser]);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);