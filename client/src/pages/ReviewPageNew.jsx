import React, { useEffect, useState, useContext } from 'react';
import '../css/ReviewPageNew.css';
import Markdown from 'react-markdown'
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
import Canvas3D from '../components/utils/Canvas3D';
import { useNavigate } from 'react-router-dom';

function ReviewPage() {
  // access global values and functions
  const { gJobRole, gQtns, gAns, gEmotionData, gValidReview, gSuspiciousCount, setGValidReview } = useContext(GlobalContext);

  const [ review, setReview] = useState('');
  const [ displayText, setDisplayText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const navigate = useNavigate();

  // typing effect--------------
  useEffect(()=>{
    let count = 0;
    let temp = "";
    let speed = review.length > 1000 ? 20 : 40;
    const intervalId = setInterval(() => {
        if(count >= review.length) {
            clearInterval(intervalId);
            return;
        }

        temp += review[count];
        setDisplayText(temp);
        count++;
    }, speed);
    return () => clearInterval(intervalId);
  },[review]);

  // check if valid entry to review page
  useEffect(()=>{
    if(!gValidReview) {
        window.location.replace('/'); // Re-direct to home page
    }
  },[]);

  // call getReview
  useEffect(()=>{
    getReview();
  },[gAns]); // call when ans data is loaded, then rest variables are assumed loaded

  const getReview = async () => {
    if(gAns.length === 0) return; // extra validation
    if(review !== '') return; // extra validation

    try {
        const userId = localStorage.getItem('userId');
        // First get the latest interview for this user
        const interviewResponse = await axios.get('http://localhost:5000/api/interviews', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const latestInterview = interviewResponse.data[interviewResponse.data.length - 1];
        
        const response = await axios.post('http://localhost:5000/api/get-review', {
            job_role: gJobRole,
            qns: gQtns,
            ans: gAns,
            emotion: gEmotionData,
            suspiciousCount: gSuspiciousCount,
            interview_id: latestInterview.id // Add interview_id
        });

        setReview(response.data.review);
    } catch(error) {
        toast.error(error.response?.data?.errorMsg || error.message || "Something went wrong",
            { ...toastErrorStyle(), autoClose: 2000 }
        );
        console.error("Error in getReview:", error);
    }
  }

  const handleSpeak = (text) => {
    if (speechSynthesis) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        // Customize voice properties
        utterance.rate = 0.9; // Speed
        utterance.pitch = 1; // Pitch
        utterance.volume = 1; // Volume

        speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
    }
  };

  // Auto-read feedback when review is generated
  useEffect(() => {
    if (review && review.length > 0) {
        handleSpeak(review);
    }
  }, [review]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }
    };
  }, []);

  const gotoHomePage = () => {
    // Reset necessary global states before navigating
    setGValidReview(false);
    navigate('/home', { replace: true }); // Navigate to home instead of interview
  };

  return (
      <div className='review-main-div'>

        {/* Review display part */}
        <div className='left-main-div'>
          { 
            review.length <= 0 ? 
            <div className='loading-div'>
              <Canvas3D pos={[0,-3,0]} scale={[6.5,6.5,6.5]} modelPath={'/robot1.glb'} classname={'robotloading'} />
              <center><h1>Generating Review...</h1></center>
            </div>
          :
          <div className='review-text-mainDiv'>
              <div className='robotImage-div'>
                <Canvas3D pos={[0,-3,0]} scale={[6.7,6.7,6.7]} modelPath={'/robot1.glb'} classname={'robotImage'} />
                <h1>FeedBack</h1>
              </div>
              <div className='review-text-wrapper'>
                <Markdown className='review-text'>{displayText}</Markdown>
                <button 
                  className={`speak-button ${isSpeaking ? 'speaking' : ''}`}
                  onClick={() => isSpeaking ? stopSpeaking() : handleSpeak(review)}
                >
                  {isSpeaking ? 'Stop Reading' : 'Read Feedback'}
                </button>
              </div>
          </div>
          }
        </div>

        <div className='right-main-div'>
          <div className='right-content1-main'>
            <div className='right-content1-sub1'>
              <div className='right-content1-sub1-text'>
                <p>
                  Thank You <br/>for choosing our<br/> Kruthak Samvahan
                </p>
              </div>
              <div className='right-content1-sub1-model'>
                <Canvas3D pos={[0,0,0]} scale={[0.015,0.015,0.015]} 
                  modelPath={'/rubix_cube2.glb'} classname={'threeD_model'} 
                  preset={'apartment'} camControls={true}/>
              </div>
            </div>
            <div className='right-content1-sub2'>
              <p>
                Hey there! Thanks for picking our Mock Interview System to help you get interview-ready. 
                We're here to give you a real feel of what it's like to sit through interviews, minus the stress. 
                Whether you're gearing up for your first job, switching careers, or just want to ace that next big opportunity, we've got you covered. 
                Practice with us, get feedback, and walk into your interviews with confidence. Let's make sure you're ready to impress!
              </p>
            </div>

          </div>
          <div className='right-content2-main'>
            <p>
              Want to Test your skills again?
            </p>
            <button onClick={gotoHomePage} className="take-interview-btn">
              Take New Interview
            </button>
          </div>
        </div>
      </div>
    );
}

export default ReviewPage;