import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css';

const Success = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="check-container">
          <div className="check-icon">✓</div>
        </div>
        
        <h1>Booking Successful!</h1>
        <p className="message">Your ticket is confirmed. Enjoy your movie!</p>
        
        <div className="ticket-summary">
          <div className="summary-item">
            <span>Status</span>
            <span className="status-badge">Confirmed</span>
          </div>
          <div className="summary-item">
            <span>Transaction ID</span>
            <span>#BMS8829102</span>
          </div>
        </div>

        <Link to="/" className="home-btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default Success;