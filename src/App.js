import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, {useState} from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login'; // Import barobar aahe ka check kara
import MovieDetails from './pages/MovieDetails'; // Import barobar aahe ka check kara 
import BookSeats from './pages/BookSeats';  
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';   
import Success from './pages/Success';
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminDashboard from './components/AdminDashboard'; 
import ShowList from './components/ShowList'; 
import WatchPage from './components/WatchPage';
import GoogleSuccess from './pages/GoogleSuccess';  



function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <BrowserRouter>
        <Navbar setSearchQuery={setSearchQuery}/> 
      <Routes>
        
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} /> 
        <Route path="/book-seat/:id/:time" element={<ProtectedRoute><BookSeats /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} /> 
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/liveshows" element={<ProtectedRoute><ShowList searchQuery={searchQuery} /></ProtectedRoute>} />
        <Route path="/watch/:videoId" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
        <Route path="/google-success" element={<GoogleSuccess />} />

      
      </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App; // Fakt dusra default export
