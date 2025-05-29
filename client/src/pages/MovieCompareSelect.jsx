import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    TextField,
    CircularProgress,
    Autocomplete,
    Pagination,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { routesGen } from '../routes/routes';
import mediaApi from '../api/modules/media.api';
import tmdbConfigs from '../api/configs/tmdb.configs';
import { toast } from 'react-toastify';

const MovieCompareSelect = () => {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie1, setSelectedMovie1] = useState(null);
    const [selectedMovie2, setSelectedMovie2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allMovies, setAllMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMovies();
    }, [page]);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const { response, err } = await mediaApi.getList({
                mediaType: tmdbConfigs.mediaType.movie,
                mediaCategory: tmdbConfigs.mediaCategory.popular,
                page
            });

            if (err) throw err;
            setAllMovies(response.results);
            setTotalPages(response.total_pages);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const { response, err } = await mediaApi.search({
                mediaType: tmdbConfigs.mediaType.movie,
                query
            });

            if (err) throw err;
            setSearchResults(response.results);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompare = () => {
        if (!selectedMovie1 || !selectedMovie2) {
            toast.error('Please select two movies to compare');
            return;
        }

        navigate(routesGen.movieComparison.path
            .replace(':movie1Id', selectedMovie1.id)
            .replace(':movie2Id', selectedMovie2.id)
        );
    };

    const handleMovieSelect = (movie) => {
        if (!selectedMovie1) {
            setSelectedMovie1(movie);
        } else if (!selectedMovie2) {
            setSelectedMovie2(movie);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, md: 10 } }}>
            <Typography variant="h4" gutterBottom>
                Compare Movies
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Select two movies to compare their details, ratings, and more.
            </Typography>

            {/* Search Section */}
            <Box sx={{ mb: 6 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={searchResults}
                            getOptionLabel={(option) => option.title || ''}
                            loading={loading}
                            value={selectedMovie1}
                            onChange={(event, newValue) => setSelectedMovie1(newValue)}
                            onInputChange={(event, newValue) => {
                                setSearchQuery(newValue);
                                handleSearch(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search for first movie"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={tmdbConfigs.posterPath(option.poster_path)}
                                            alt={option.title}
                                            style={{ width: 40, marginRight: 10 }}
                                        />
                                        {option.title}
                                    </Box>
                                </li>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={searchResults}
                            getOptionLabel={(option) => option.title || ''}
                            loading={loading}
                            value={selectedMovie2}
                            onChange={(event, newValue) => setSelectedMovie2(newValue)}
                            onInputChange={(event, newValue) => {
                                setSearchQuery(newValue);
                                handleSearch(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search for second movie"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={tmdbConfigs.posterPath(option.poster_path)}
                                            alt={option.title}
                                            style={{ width: 40, marginRight: 10 }}
                                        />
                                        {option.title}
                                    </Box>
                                </li>
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Selected Movies Preview */}
            {(selectedMovie1 || selectedMovie2) && (
                <Box sx={{ mb: 6, backgroundColor: 'background.paper', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Selected Movies
                    </Typography>
                    <Grid container spacing={3}>
                        {selectedMovie1 && (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={tmdbConfigs.posterPath(selectedMovie1.poster_path)}
                                        alt={selectedMovie1.title}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{selectedMovie1.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedMovie1.overview}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                        {selectedMovie2 && (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={tmdbConfigs.posterPath(selectedMovie2.poster_path)}
                                        alt={selectedMovie2.title}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{selectedMovie2.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedMovie2.overview}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleCompare}
                            disabled={!selectedMovie1 || !selectedMovie2}
                        >
                            Compare Movies
                        </Button>
                    </Box>
                </Box>
            )}

            {/* All Movies Grid */}
            <Box sx={{ backgroundColor: 'background.paper', p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Browse All Movies
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {allMovies.map((movie) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                                    <Card 
                                        sx={{ 
                                            cursor: 'pointer',
                                            transform: 'scale(1)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        onClick={() => handleMovieSelect(movie)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={tmdbConfigs.posterPath(movie.poster_path)}
                                            alt={movie.title}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" noWrap>
                                                {movie.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {movie.overview}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
                            <Pagination 
                                count={totalPages} 
                                page={page} 
                                onChange={handlePageChange} 
                                color="primary"
                            />
                        </Stack>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default MovieCompareSelect; 