import React from 'react';
import { useTheme } from '../utils/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    return (
        <div className={`${theme}-bg footer-pin`}>
            <p>
                Made with &hearts; by Team 2
            </p>
        </div>
    )
};

export default Footer;