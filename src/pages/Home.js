import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) 
  )

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchAndSync = async () => {
      try {
        setLoading(true);

        // 1. TMDB kadhun Real-time Hindi movies aanne
        const startDate = "2025-12-12";
        const endDate = "2026-03-31";
        const TMDB_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=IN&with_original_language=hi&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=primary_release_date.desc`;

        const response = await fetch(TMDB_URL);
        const data = await response.json();
        const tmdbMovies = data.results || [];

        // 2. HA DATA BACKEND LA SAVE KARAYLA PATHVNE
        if (tmdbMovies.length > 0) {
            await axios.post("https://housefullbackend.onrender.com/api/movies/sync-from-frontend", {
                movies: tmdbMovies
            });
            console.log("Database updated with TMDB movies!");
        }

        setMovies(tmdbMovies);
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSync();
  }, [API_KEY]);

  if (loading) return <div className="loading"><h2>Loading Real-time Movies...</h2></div>;

  return (
    <div className="content-area">
      <h2 className="title">Latest Hindi Movies </h2>
      <div className="movie-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
              />
              <div className="card-info">
                <h3>{movie.title}</h3>
                <p>⭐ {movie.vote_average}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

