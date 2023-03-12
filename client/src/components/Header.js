import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };
    const [isActive, setActive] = useState("false");
    const toggleClass = () => {
        setActive(!isActive);
    };
    let location = useLocation();
    if(Auth.loggedIn()){
    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <h1 className='is-size-1 has-text-weight-bold title-name'>Support Hero</h1>
                <div role="button" className={isActive ? "is-active navbar-burger" : "navbar-burger"} onClick={toggleClass} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>

            <div className={isActive ? "is-active navbar-menu" : "navbar-menu"}>
                <div className='navbar-end'>
                    {location.pathname !== '/' && 
                    <div className='navbar-item' >
                        <a><Link to='/'>Home</Link></a>
                    </div> }
                    <div className='navbar-item'>
                        <a onClick={logout}>Logout</a>
                    </div>
                </div>
            </div>
        </nav>

    )}
};

export default Header;