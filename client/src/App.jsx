import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Content from './components/Content';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Content />
            </AuthProvider>
        </Router>
    )
}

export default App;