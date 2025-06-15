import React from 'react';
import { Link } from 'react-router-dom';
import '../css/BaseTemplate.css';

const BaseTemplate = ({ children }) => {
  return (
    <div className="base-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Mock Interview System</Link>
        </div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Mock Interview System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BaseTemplate; 