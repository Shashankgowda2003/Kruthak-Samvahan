import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import { GlobalProvider } from './components/utils/GlobalState';
import ReviewPage from './pages/ReviewPageNew';
import 'bootstrap/dist/css/bootstrap.min.css';
import InterviewHistory from './pages/InterviewHistory';

const App = () => {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/interviewhistory" element={<InterviewHistory />} />

        </Routes>
      </GlobalProvider>
    </Router>
  );
};

export default App;