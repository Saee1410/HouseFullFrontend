import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [tmdbMovie, setTmdbMovie] = useState(null);
  const [dbMovie, setDbMovie] = useState(null); 
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY ;

  
  
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. TMDB Data (Story, Poster etc.)
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        const tmdbData = await tmdbRes.json();
        setTmdbMovie(tmdbData);
       
        // 2. Backend Data (Theater info) - Yala veglya try-catch madhe theva
        try {
          const dbRes = await axios.get(`https://housefullbackend.onrender.com/api/movies/details/${id}`);
          setDbMovie(dbRes.data);
        } catch (dbErr) {
          console.log("Database entry not found, showing only TMDB info.");
        }

      } catch (err) {
        console.error("Main fetch error:", err);
      } finally {
        setLoading(false); // Loading nehami band kara
      }
    };

    if (id) fetchAllData();
  }, [id, API_KEY]);

  if (loading) return <div className="loading-screen"><h1>Loading Premium Experience...</h1></div>;
  
  // Jar TMDB cha data nasel tarach blank disel, mhanun ha check garjecha aahe
  if (!tmdbMovie || tmdbMovie.success === false) {
    return <div className="error-screen"><h1>Movie Not Found! Check API Key.</h1></div>;
  }

  return (
    <div className="movie-details-wrapper">
      <div className="hero-section" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-meta">
              <span className="rating-tag">⭐ {tmdbMovie.vote_average?.toFixed(1)}</span>
              <span>{tmdbMovie.runtime} min</span>
              <span>{tmdbMovie.release_date?.split("-")[0]}</span>
              {/* Theater logic fix: Jar DB madhe entry nasel tar default dakhva */}
              <span className="theater-tag">📍 {dbMovie?.theaterName || dbMovie?.theaters?.[0] || "Cineplex Nashik"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="poster-container">
          <img className="main-poster" src={`https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`} alt={tmdbMovie.title} />
        </div>

        <div className="details-info">
          <div className="section">
            <h3 className="section-label">Overview</h3>
            <p className="overview-text">{tmdbMovie.overview}</p>
          </div>

          <div className="genres-list">
            {tmdbMovie.genres?.map(g => <span key={g.id} className="genre-pill">{g.name}</span>)}
          </div>

          <div className="booking-section">
            <h3 className="section-label">Select Show Time & Book</h3>
            <div className="time-grid">
              {["10:00 AM", "01:30 PM", "06:00 PM", "09:00 PM"].map((time) => (
                <div key={time} className="time-card">
                  <span className="time-val">{time}</span>
                  <Link to={`/book-seat/${tmdbMovie.id}/${time}`} className="book-btn-small">
                  Book Your Seat
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;