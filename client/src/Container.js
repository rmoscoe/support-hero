import React from 'react';
import App from './App';

import ThemeProvider from './utils/ThemeContext';

export default function Container() {
    return (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    );
}