// frontend/src/api/movieApi.js
import axios from 'axios';

export const addMovieToDB = async (movie) => {
  try {
    const res = await axios.post('http://localhost:5000/api/movies/add-movie', movie);
    console.log("Movie added:", res.data);
  } catch (err) {
    console.error("Error adding movie:", err);
  }
};

// Usage
addMovieToDB({
  tmdbId: 1608982,
  title: "Happy Patel: Khatarnak Jasoos",
  poster: "https://image.tmdb.org/t/p/w500/abcd.jpg",
  description: "Comedy thriller",
  rating: 8.083,
  releaseDate: "2025-12-15",
  category: "Movie",
  theaters: ["Cineplex Nashik"]
});
