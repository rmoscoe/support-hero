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
                    {location.pathname !== '/homepage' && 
                    <div className='navbar-item' >
                        <button class="button is-primary" ><Link to='/homepage'>Home</Link></button>
                    </div> }
                    <div className='navbar-item'>
                        <button class="button is-info" onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>

    )}
};

export default Header;