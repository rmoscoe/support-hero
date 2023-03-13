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
            localStorage.setItem('theme', 'dark');
        } else if (theme === 'dark') {
            setTheme('light');
            document.body.style.backgroundColor = '#ffffff';
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);
