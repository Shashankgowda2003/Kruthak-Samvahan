import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Kruthak Samvahan</div>
            <div className="navbar-right">
                <span className="welcome-text">Welcome, {username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
