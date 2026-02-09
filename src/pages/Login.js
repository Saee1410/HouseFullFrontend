import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://housefullbackend.onrender.com/api/users/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);

                localStorage.setItem("loggedInUser", JSON.stringify({
                    email: response.data.user.email,
                    name: response.data.user.name
                }));
                alert('Login Successfully');
                navigate('/');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    }

    const handleGoogleLogin = () => {
        window.open('http://housefullbackend.onrender.com/api/users/google', '_self');
    }

    return (
        <div className="bms-wrapper">
            <div className="bms-card">
                <div className="bms-header">
                    <h2>Login</h2>
                    <p>Unlock the best movie experience!</p>
                </div>
                
                <form onSubmit={handleLogin} className="bms-form">
                    <div className="bms-input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            required 
                        />
                    </div>
                    
                    <div className="bms-input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter password" 
                            required 
                        />
                    </div>

                    <button
                     type="button"
                     onClick={handleGoogleLogin} 
                     className="google-btn"
                     >
                     <img 
    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
    alt="Google Logo" 
    className="google-logo" 
  />
                           <span>Continue with Google</span>
                    </button>

                    
                    <button type="submit" className="bms-btn">Continue</button>
                </form>

                <div className="bms-footer">
                    <p>New to HouseFull? <Link to="/signup">Create an account</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
