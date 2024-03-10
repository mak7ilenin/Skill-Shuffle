import React from 'react';

import Header from './components/Header';
import Content from './components/Content';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Header />
            <Content />
        </AuthProvider>
    )
}

export default App;