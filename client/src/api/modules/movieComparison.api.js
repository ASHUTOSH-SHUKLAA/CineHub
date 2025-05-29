import axiosClient from '../axios/axios.client';

const movieComparisonApi = {
    createComparison: async (data) => {
        const response = await axiosClient.post('/movie-comparisons', data);
        return response;
    },

    getComparison: async (comparisonId) => {
        const response = await axiosClient.get(`/movie-comparisons/${comparisonId}`);
        return response;
    },

    vote: async (comparisonId, data) => {
        const response = await axiosClient.post(`/movie-comparisons/${comparisonId}/vote`, data);
        return response;
    },

    getMovieStats: async (movieId) => {
        const response = await axiosClient.get(`/movie-comparisons/stats/${movieId}`);
        return response;
    },

    getTrendingComparisons: async () => {
        const response = await axiosClient.get('/movie-comparisons/trending');
        return response;
    }
};

export default movieComparisonApi; 