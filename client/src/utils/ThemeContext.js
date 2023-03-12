import React, { useState, useContext, useEffect } from 'react';

export const ThemeContext = React.createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.style.backgroundColor = '#121212';
            document.body.style.backgroundColor = '#121212';
            console.log('changing to dark');

        } else if (theme === 'dark') {
            setTheme('light');
            document.documentElement.style.backgroundColor = '#ffffff';
            document.body.style.backgroundColor = '#ffffff';
            console.log('changing to light');
        }
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        // Dark theme and toggle theme are getting provided to the child components
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}