import React, { useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../animations/Main Scene (1).json';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const handleLogin = async () => {
        let isValid = true;
        const errors = { username: '', password: '' };

        if (!username.trim()) {
            errors.username = 'Username is required';
            isValid = false;
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
            isValid = false;
        }

        setFormErrors(errors);

        if (isValid) {
            setIsSubmitting(true);
            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // Store user details in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('username', data.user.username); // Ensure username is stored
                    console.log('Login successful:', data);
                    window.location.href = '/home';
                } else {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData);
                    alert(errorData.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <header className="login-header">
                    <h1>Welcome to Kruthak Samvahan</h1>
                    <p className="subtitle">Your path to interview success starts here</p>
                </header>

                <div className="login-content">
                    <div className="login-form-container">
                        <div className="form-title">Secure Login</div>
                        <form
                            className="login-form"
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                handleLogin(); // Call the handleLogin function
                            }}
                        >
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="username"
                                    placeholder=" "
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={formErrors.username ? 'error' : ''}
                                />
                                <label htmlFor="username">Username</label>
                                {formErrors.username && (
                                    <div className="error-message">{formErrors.username}</div>
                                )}
                            </div>

                            <div className="form-group relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder=" "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={formErrors.password ? 'error' : ''}
                                />
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                                {formErrors.password && (
                                    <div className="error-message">{formErrors.password}</div>
                                )}
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={isRememberMe}
                                        onChange={() => setIsRememberMe(!isRememberMe)}
                                    />
                                    Remember me
                                </label>
                                <a href="/forgot-password" className="forgot-password">
                                    Forgot Password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="signup-prompt">
                                <span>Don't have an account?</span>
                                <a href="/signup" className="signup-link">Sign up</a>
                            </div>
                        </form>
                    </div>

                    <div className="advertisement-panel">
                        <div className="lottie-container">
                            <Lottie options={defaultOptions} height={200} width={200} />
                        </div>
                        <h3>Join Kruthak Samvahan Today!</h3>
                        <p>Get access to our comprehensive interview preparation resources</p>
                        {/* <button className="promo-button">Learn More</button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;