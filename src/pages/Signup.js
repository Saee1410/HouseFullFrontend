import React,{ useState } from 'react'
import './Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://housefullbackend.onrender.com/api/users/signup',
                 { name, email, password });
            if (response.data) {
                alert("User registered successfully! Please login.");
                navigate('/login');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert(error.response?.data?.message || "Signup failed");
        }
    };
 
  return (
    <div className='login-container'>
        <div className='login-card'>
            <h2>Create Account</h2>
            <p>Join us to Book your favorite shows</p>
            <form  onSubmit={handleSignup}>
                <div className='input-group'>
                    <label>Full Name</label>
                    <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='enter name'
                    required />
                </div>
                <div className='input-group'>
                    <label>Email Address</label>
                    <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='enter email'
                    required /> 
                </div>
                <div className='input-group'>
                    <label>Password</label>
                    <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='enter password'
                    required />
                </div>
                <button type="submit" className='login-btn'>Sign Up</button>    
            </form>
        </div>
    </div>
  )
}

export default Signup;