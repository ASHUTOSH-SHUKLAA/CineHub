import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Divider,
    Paper,
    Chip,
    LinearProgress,
    Stack,
    Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import movieComparisonApi from '../../api/modules/movieComparison.api';

const POLL_INTERVAL = 5000; // 5 seconds

const MovieComparison = ({ movie1, movie2, category }) => {
    const theme = useTheme();
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [reason, setReason] = useState('');
    const [stats, setStats] = useState({ movie1: null, movie2: null });
    const pollIntervalRef = useRef();

    // Fetch comparison and stats
    const fetchComparison = async () => {
        try {
            // Try to get by ID if already exists, else create
            let comp = comparison;
            if (comp && comp._id) {
                const { response, err } = await movieComparisonApi.getComparison(comp._id);
                if (err) throw err;
                setComparison(response.data);
            } else {
                const { response, err } = await movieComparisonApi.createComparison({
                    movie1Id: movie1.id,
                    movie2Id: movie2.id,
                    category
                });
                if (err) throw err;
                setComparison(response.data);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchInitial = async () => {
            try {
                const { response, err } = await movieComparisonApi.createComparison({
                    movie1Id: movie1.id,
                    movie2Id: movie2.id,
                    category
                });
                if (err) throw err;
                setComparison(response.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const [stats1, stats2] = await Promise.all([
                    movieComparisonApi.getMovieStats(movie1.id),
                    movieComparisonApi.getMovieStats(movie2.id)
                ]);
                setStats({
                    movie1: stats1.response.data,
                    movie2: stats2.response.data
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchInitial();
        fetchStats();
    }, [movie1.id, movie2.id, category]);

    // Polling for live updates
    useEffect(() => {
        if (!comparison || !comparison._id) return;
        pollIntervalRef.current = setInterval(() => {
            fetchComparison();
        }, POLL_INTERVAL);
        return () => clearInterval(pollIntervalRef.current);
        // eslint-disable-next-line
    }, [comparison?._id]);

    const handleVote = async (choice) => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for your choice');
            return;
        }

        setVoting(true);
        try {
            const { response, err } = await movieComparisonApi.vote(comparison._id, {
                choice,
                reason
            });
            if (err) throw err;
            setComparison(response.data);
            toast.success('Vote recorded successfully!');
            setReason('');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setVoting(false);
        }
    };

    const renderBoxOfficeComparison = () => (
        <Grid container spacing={3}>
            {[movie1, movie2].map((movie, idx) => {
                const statsData = idx === 0 ? stats.movie1 : stats.movie2;
                return (
                    <Grid item xs={12} md={6} key={movie.id}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                {movie.title}
                            </Typography>
                            {statsData && (
                                <>
                                    <Typography>Budget: ₹{statsData.boxOfficeStats.budget.toLocaleString('en-IN')}</Typography>
                                    <Typography>Revenue: ₹{statsData.boxOfficeStats.revenue.toLocaleString('en-IN')}</Typography>
                                    <Typography>Profit: ₹{statsData.boxOfficeStats.profit.toLocaleString('en-IN')}</Typography>
                                    <Typography>Production Time: {statsData.boxOfficeStats.productionTime}</Typography>
                                    <Typography>Release Date: {movie.release_date || 'N/A'}</Typography>
                                    <Typography>Runtime: {movie.runtime ? `${movie.runtime} min` : 'N/A'}</Typography>
                                    <Typography>Language: {movie.original_language?.toUpperCase() || 'N/A'}</Typography>
                                    <Typography>
                                        Production: {movie.production_companies?.map(c => c.name).join(', ') || 'N/A'}
                                    </Typography>
                                    <Typography>
                                        Cast: {movie.credits?.cast?.slice(0, 3).map(c => c.name).join(', ') || 'N/A'}
                                    </Typography>
                                    <Typography>
                                        Director: {movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A'}
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    );

    const renderGenreComparison = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Which movie would you prefer to watch?
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{movie1.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {movie1.overview}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleVote('movie1')}
                                    disabled={voting}
                                >
                                    Choose {movie1.title}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{movie2.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {movie2.overview}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleVote('movie2')}
                                    disabled={voting}
                                >
                                    Choose {movie2.title}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Why did you choose this movie?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={voting}
                />
            </Box>
        </Box>
    );

    const renderVotes = () => {
        if (!comparison?.votes?.length) return null;

        const movie1Votes = comparison.votes.filter(v => v.choice === 'movie1').length;
        const movie2Votes = comparison.votes.filter(v => v.choice === 'movie2').length;
        const totalVotes = movie1Votes + movie2Votes;
        const movie1Percent = totalVotes ? (movie1Votes / totalVotes) * 100 : 0;
        const movie2Percent = totalVotes ? (movie2Votes / totalVotes) * 100 : 0;

        return (
            <Box sx={{ mt: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Community Votes
                    </Typography>
                    <Tooltip title="Live updates">
                        <Chip label="LIVE" color="success" size="small" sx={{ fontWeight: 'bold', ml: 1, animation: 'pulse 1.5s infinite' }} />
                    </Tooltip>
                </Stack>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight={600} gutterBottom>{movie1.title}</Typography>
                        <LinearProgress variant="determinate" value={movie1Percent} sx={{ height: 12, borderRadius: 6, mb: 1, background: theme.palette.grey[800] }} color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            {movie1Votes} votes ({movie1Percent.toFixed(1)}%)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography fontWeight={600} gutterBottom>{movie2.title}</Typography>
                        <LinearProgress variant="determinate" value={movie2Percent} sx={{ height: 12, borderRadius: 6, mb: 1, background: theme.palette.grey[800] }} color="secondary" />
                        <Typography variant="body2" color="text.secondary">
                            {movie2Votes} votes ({movie2Percent.toFixed(1)}%)
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Recent Comments
                </Typography>
                {comparison.votes.slice(-5).reverse().map((vote, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2">
                            Voted for: {vote.choice === 'movie1' ? movie1.title : movie2.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {vote.reason}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Movie Comparison
            </Typography>
            <Chip
                label={category === 'boxOffice' ? 'Box Office Comparison' : 'Genre Comparison'}
                color="primary"
                sx={{ mb: 3 }}
            />
            
            {category === 'boxOffice' ? renderBoxOfficeComparison() : renderGenreComparison()}
            {renderVotes()}
        </Box>
    );
};

export default MovieComparison; 