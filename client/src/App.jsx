import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Content from './components/Content';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Content />
            </Router>
        </AuthProvider>
    )
}

export default App;