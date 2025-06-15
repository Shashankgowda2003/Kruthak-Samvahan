import React from 'react';
import './WelcomePage.css';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className="welcome-page">
            {/* Header */}
            <header className="main-header">
                <div className="header-container">
                    <div className="logo">
                        <h1>Kruthak Samvahan</h1>
                    </div>
                    {/* <nav className="main-nav">
                        <Link to="/about">About</Link>
                        <Link to="/features">Features</Link>
                        <Link to="/pricing">Pricing</Link>
                    </nav> */}
                    <div className="header-actions">
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-card">
                    <div className="hero-content">
                        <h1 className="hero-title">Master Your Interview Skills</h1>
                        <p className="hero-subtitle">Practice with realistic scenarios and get instant feedback</p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="btn btn-primary">Signup</Link>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-title">
                    <h2>Why Choose Our Platform?</h2>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Realistic Scenarios</h3>
                        <p>Practice with questions from top companies in your industry</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💬</div>
                        <h3>AI-Powered Feedback</h3>
                        <p>Get detailed analysis of your responses and body language</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Progress Tracking</h3>
                        <p>Monitor your improvement with detailed analytics</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👨‍💻</div>
                        <h3>Technical Interviews</h3>
                        <p>Practice coding challenges and system design questions</p>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonial-section">
                <div className="section-title">
                    <h2>What Our Users Say</h2>
                </div>
                <div className="testimonial-grid">
                    <div className="testimonial-card">
                        <p className="testimonial-text">"This platform helped me land my dream job at Google. The mock interviews were incredibly realistic and the feedback was invaluable."</p>
                        <div className="testimonial-author">
                            <div className="author-info">
                                <h4>John Doe</h4>
                                <p>Software Engineer at Google</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <p className="testimonial-text">"I've used many interview preparation tools, but this one stands out with its comprehensive feedback and variety of question types."</p>
                        <div className="testimonial-author">
                            <div className="author-info">
                                <h4>Jane Smith</h4>
                                <p>Product Manager at Amazon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Ace Your Next Interview?</h2>
                        <p className="cta-subtitle">Join thousands of successful candidates today</p>
                        <div className="cta-buttons">
                            <Link to="/signup" className="btn btn-primary">Start Free Trial</Link>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>Kruthak Samvahan</h3>
                        <p>All rights reserver @Kruthak Samvahan 2025</p>
                    </div>
                    {/* <div className="footer-column">
                        <h4>Quick Links</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/features">Features</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div className="footer-column">
                        <h4>Follow Us</h4>
                        <a href="#" className="social-link">Facebook</a>
                        <a href="#" className="social-link">Twitter</a>
                        <a href="#" className="social-link">LinkedIn</a>
                    </div> */}
                    <div className="footer-bottom">
                       
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;