import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './InterviewHistory.css';

const InterviewHistory = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [interviewCount, setInterviewCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // Fetch user details if username not in localStorage
            fetchUserDetails();
        }
        fetchInterviews();
    }, [navigate]);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/get-user-details', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.user.username);
                localStorage.setItem('username', data.user.username);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchInterviews = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await fetch('http://localhost:5000/api/interviews', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch interviews');
            }

            const data = await response.json();
            setInterviews(data);
            setInterviewCount(data.length); // Set the count
            setLoading(false);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            setError('Failed to load interview history');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="interview-history">
                <div className="interview-header">
                    <h1>Interview History</h1>
                    <div className="user-stats">
                        <p>Welcome, {username}</p>
                        <p>Total Interviews: {interviewCount}</p>
                    </div>
                </div>
                <div className="interview-list">
                    {interviews.length === 0 ? (
                        <p>No interviews found</p>
                    ) : (
                        interviews.map((interview) => (
                            <div key={interview.id} className="interview-card">
                                <h3>{interview.job_role}</h3>
                                <p>Experience Level: {interview.experience_level}</p>
                                <p>Date: {new Date(interview.created_at).toLocaleDateString()}</p>
                                {interview.feedback_summary && (
                                    <div className="feedback-summary">
                                        <h4>Feedback Summary:</h4>
                                        <p>{interview.feedback_summary}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewHistory;