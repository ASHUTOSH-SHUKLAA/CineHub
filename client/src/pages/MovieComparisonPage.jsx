import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import MovieComparison from '../components/movie/MovieComparison';
import mediaApi from '../api/modules/media.api';
import { toast } from 'react-toastify';
import tmdbConfigs from '../api/configs/tmdb.configs';

const MovieComparisonPage = () => {
    const { movie1Id, movie2Id } = useParams();
    const [movies, setMovies] = useState({ movie1: null, movie2: null });
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('genre');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [movie1Response, movie2Response] = await Promise.all([
                    mediaApi.getDetail({ mediaType: tmdbConfigs.mediaType.movie, mediaId: movie1Id }),
                    mediaApi.getDetail({ mediaType: tmdbConfigs.mediaType.movie, mediaId: movie2Id })
                ]);

                if (movie1Response.err || movie2Response.err) {
                    throw new Error('Failed to fetch movies');
                }

                setMovies({
                    movie1: movie1Response.response,
                    movie2: movie2Response.response
                });
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [movie1Id, movie2Id]);

    const handleCategoryChange = (event, newValue) => {
        setCategory(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, md: 10 } }}>
            <Typography variant="h4" gutterBottom>
                Compare Movies
            </Typography>
            <Tabs
                value={category}
                onChange={handleCategoryChange}
                sx={{ mb: 3 }}
            >
                <Tab label="Genre Comparison" value="genre" />
                <Tab label="Box Office Comparison" value="boxOffice" />
            </Tabs>
            <MovieComparison
                movie1={movies.movie1}
                movie2={movies.movie2}
                category={category}
            />
        </Container>
    );
};

export default MovieComparisonPage; 