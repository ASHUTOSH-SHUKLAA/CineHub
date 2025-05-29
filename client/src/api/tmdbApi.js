import axios from 'axios';

const tmdbApi = {
    getMovieDetails: async (movieId) => {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export { tmdbApi }; 