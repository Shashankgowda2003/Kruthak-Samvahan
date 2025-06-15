import React, { useContext, useEffect, useState } from 'react';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '../components/utils/GlobalState';
import Navbar from '../components/Navbar/Navbar';

function HomePage() {
    const { updateGQtnGenerationData, setGValidInterview, setGValidReview, user } = useContext(GlobalContext);
    const [jobInput, setJobInput] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [experienceLevel, setExperienceLevel] = useState('fresher');
    const navigate = useNavigate();
    const [displayText, setDisplayText] = useState('');

    useEffect(()=>{
        const text = "From Practice to Perfection - Your Interview Journey Starts Here!";
        let count = 0;
        let temp = "";
        const intervalId = setInterval(() => {
            if(count >= text.length) {
                clearInterval(intervalId);
                return;
            }
            temp += text[count];
            setDisplayText(temp);
            count++;
        }, 100);
        return () => clearInterval(intervalId);
    },[]);

    useEffect(()=>{
        setGValidReview(false); // once entered homepage then cannot go to review page unless interview is done
    },[])

    const handleGetStartedClick = () => {
        setIsVisible(false); // Hide the jobTitle-div
    };

    const handleBackClick = () => {
        setIsVisible(true); // Show the jobTitle-div
        setExperienceLevel('fresher');
        setJobInput('');
    };

    const handleStartInterviewClick = async () => {
        const sendingInput = jobInput.trim();
        const userId = localStorage.getItem('userId'); // Get userId from localStorage

        if (!userId) {
            toast.error("Please login again", { ...toastErrorStyle(), autoClose: 2000 });
            navigate('/login');
            return;
        }

        if (sendingInput.length > 0) {
            try {
                setIsLoading(true);
                const response = await axios.post('http://localhost:5000/api/get-questions', {
                    job_role: sendingInput,
                    experience_lvl: experienceLevel
                });

                // Save the interview details
                await axios.post('http://localhost:5000/api/save-interview', {
                    user_id: userId, // Use userId from localStorage
                    job_role: sendingInput,
                    experience_level: experienceLevel,
                    status: 'in-progress'
                });

                updateGQtnGenerationData(response.data.job_role, response.data.exp_lvl, response.data.qtns);
                setGValidInterview(true); // set as global valid interview as true
                navigate('/interview');
            } catch (error) {
                toast.error(error.response ? error.response.data.errorMsg : error.message || error,
                    { ...toastErrorStyle(), autoClose: 2000 }
                );
                console.log("Something went wrong!", error.response ? error.response.data.errorMsg : error.message || error);
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Please provide job title!", { ...toastErrorStyle(), autoClose: 2000 });
        }
    };

    const handleExperienceChange = (event) => {
        setExperienceLevel(event.target.value);
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setJobInput(inputValue);
    };

    return (
        <div>
            <Navbar />
            <div className='Home-div'>
                <div className='header-div'>
                    {/* <h1 className='header-text'>MOCK INTERVIEW</h1> */}
                </div>
                    <div className='interview-history-button'>     
                    <button 
                        onClick={() => navigate('/interviewhistory')}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            ':hover': {
                                backgroundColor: '#45a049',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        View Interview History
                    </button>
                </div>
                <div className='context-div'>
                    <div className='text-div'>
                       <div className='Typing-effect'>
                            <p>{displayText}</p>
                       </div>

                        <button
                            className={`getStartedButton ${isVisible ? '' : 'hidden'}`}
                            onClick={handleGetStartedClick}>Get Started</button>
                    </div>

                    <div className='video-div'>
                        <video className='video-tag' src={'/assets/homePageVideo1.mp4'} autoPlay muted loop/>
                    </div>

                    <div className={`jobTitle-div ${isVisible ? 'hidden' : ''}`}>
                        <FaArrowLeftLong className='Left-arrow' onClick={!isLoading ? handleBackClick : null} />
                        <label className='joblabel'>Enter job role</label>
                        <input className='jobinput' type='text' value={jobInput} onChange={handleInputChange}
                            maxLength={35} placeholder='Eg: Java Developer' disabled={isLoading}/>
                        <div className='radio-div'>
                            <label>
                                <input type='radio' name='experienceLevel' value='fresher' checked={experienceLevel === 'fresher'}
                                    onChange={handleExperienceChange} disabled={isLoading}/>
                                Fresher
                            </label>
                            <label>
                                <input type='radio' name='experienceLevel' value='intermediate' checked={experienceLevel === 'intermediate'}
                                    onChange={handleExperienceChange} disabled={isLoading} />
                                Intermediate
                            </label>
                            <label>
                                <input type='radio' name='experienceLevel' value='experienced' checked={experienceLevel === 'experienced'}
                                    onChange={handleExperienceChange} disabled={isLoading} />
                                Experienced
                            </label>
                        </div>

                        <button className='StartInterviewButton' onClick={handleStartInterviewClick} disabled={isLoading}>
                            {isLoading ? <> Preparing Interview <FontAwesomeIcon icon={faSpinner} spin /> </>
                                : 'Start your interview'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
