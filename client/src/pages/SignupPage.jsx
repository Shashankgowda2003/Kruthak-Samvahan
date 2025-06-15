import React, { useState } from 'react';
import './SignupPage.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/signup', {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),  
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            const data = await response.json();
            console.log('Signup successful:', data);
            window.location.href = '/home';
        } catch (error) {
            console.error('Error during signup:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <header className="signup-header">
                    <h1>Create Your Account</h1>
                    <p>Join Kruthak Samvahan and prepare for your dream job</p>
                </header>
                
                <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        {/* <label htmlFor="fullName">Full Name</label> */}
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                    </div>

                    <div className="form-group">
                        {/* <label htmlFor="username">Username</label> */}
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        {/* <label htmlFor="email">Email</label> */}
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        {/* <label htmlFor="password">Password</label> */}
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <button 
                        type="submit" 
                        onClick={handleSignup} 
                        disabled={isSubmitting}
                        className="signup-button"
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;