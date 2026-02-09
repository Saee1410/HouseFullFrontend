import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setSearchQuery }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
   
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        
        {/* LOGO SECTION */}
        <Link to="/" className="navbar-logo">
          <i className="fas fa-ticket-alt logo-icon"></i> 
          HOUSE<span className="logo-span">FULL</span>
        </Link>

        {/* PROFESSIONAL SEARCH BAR */}
        <div className='nav-search-container'>
          <div className='search-group'>
            <i className="fas fa-search search-bar-icon"></i> 
            <input 
              type="text"
              className='search-input'
              placeholder='Search for movies, events...'
              onChange={(e) => setSearchQuery ? setSearchQuery(e.target.value) : null} 
            />
          </div>
        </div>

        {/* RIGHT MENU */}
        <div className='nav-right'>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-links">Home</Link></li>
            <li><Link to="/admin" className="nav-links">Admin</Link></li>
            <li><Link to="/liveshows" className="nav-links">LiveShow</Link></li>
          </ul>

          <div className="nav-auth">
            {token ? (
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            ) : (
              <button onClick={() => navigate('/login')} className="login-btn">Login</button>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;