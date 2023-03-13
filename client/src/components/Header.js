import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

const Header = () => {
    const { theme } = useTheme();
    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };
    const [isActive, setActive] = useState("false");
    const toggleClass = () => {
        setActive(!isActive);
    };
    let location = useLocation();
    if (Auth.loggedIn()) {
        return (
            <nav className={`${theme} navbar`}>
                <div className={`${theme} navbar-brand`}>
                    <h1 className={`${theme}-title is-size-1 has-text-weight-bold`}>Support Hero</h1>
                    <div role="button" className={isActive ? `${theme} is-active navbar-burger` : `${theme} navbar-burger`} onClick={toggleClass} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                </div>

            <div className={`${isActive ? "is-active navbar-menu" : "navbar-menu"} ${theme}`}>
                <div className='navbar-end'>
                    {location.pathname !== '/' && 
                    <div className='navbar-item' >
                        <button className="button is-primary" ><Link to='/'>Home</Link></button>
                    </div> }
                    <div className='navbar-item'>
                            <button className={`button ${theme}-quaternary`} onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
        )
    }
};

export default Header;