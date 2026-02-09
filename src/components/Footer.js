import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="footer-logo">HOUSE<span>FULL</span></h2>
          <p>
            Nashik's favorite destination for movie tickets. Experience the best cinema with us!
          </p>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>📍 Cineplex Nashik, Maharashtra</p>
          <p>📧 support@housefull.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} HouseFull | Designed by You
      </div>
    </footer>
  );
}

export default Footer;