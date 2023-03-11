import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';


const Header = () => {
    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };
    const [isActive, setActive] = useState("false");
    const toggleClass = () => {
        setActive(!isActive);
    };
    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <h1>Support Hero</h1>
                <div role="button" className={isActive ? "is-active navbar-burger" : "navbar-burger"} onClick={toggleClass} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>

            <div className={isActive ? "is-active navbar-menu" : "navbar-menu"}>
                <div className='navbar-end'>
                    <div className='navbar-item' >
                        <Link to='/homepage'>Home</Link>
                    </div>
                    <div className='navbar-item'>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>

    )
};

export default Header;