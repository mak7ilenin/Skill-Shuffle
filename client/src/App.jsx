import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Content from './components/Content';
import { AuthProvider } from './components/AuthContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('auth-user') !== '' && sessionStorage.getItem('auth-user') !== null;
    });

    return (
        <Router>
            <AuthProvider>
                <Header setIsAuthenticated={setIsAuthenticated} />
                <Content isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            </AuthProvider>
        </Router>
    )
}

export default App;