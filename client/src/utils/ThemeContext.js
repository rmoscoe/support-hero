import React, { useState, useContext, useEffect } from 'react';

export const ThemeContext = React.createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
    let savedTheme = localStorage.getItem('theme') || 'light';
    const [theme, setTheme] = useState(savedTheme);
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.body.style.backgroundColor = '#121212';
            console.log('changing to dark');
            localStorage.setItem('theme', 'dark');
        } else if (theme === 'dark') {
            setTheme('light');
            document.body.style.backgroundColor = '#ffffff';
            console.log('changing to light');
            localStorage.setItem('theme', 'light');
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