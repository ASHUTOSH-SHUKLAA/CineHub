const MovieComparison = require('../models/movieComparison.model');
const Movie = require('../models/movie.model');

const movieComparisonController = {
    // Create a new comparison
    createComparison: async (req, res) => {
        try {
            const { movie1Id, movie2Id, category } = req.body;

            // Check if movies exist
            const [movie1, movie2] = await Promise.all([
                Movie.findById(movie1Id),
                Movie.findById(movie2Id)
            ]);

            if (!movie1 || !movie2) {
                return res.status(404).json({ message: 'One or both movies not found' });
            }

            const comparison = new MovieComparison({
                movie1: movie1Id,
                movie2: movie2Id,
                category
            });

            await comparison.save();
            res.status(201).json(comparison);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get comparison details
    getComparison: async (req, res) => {
        try {
            const comparison = await MovieComparison.findById(req.params.id)
                .populate('movie1')
                .populate('movie2')
                .populate('votes.userId', 'name');

            if (!comparison) {
                return res.status(404).json({ message: 'Comparison not found' });
            }

            res.status(200).json(comparison);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Vote on a comparison
    vote: async (req, res) => {
        try {
            const { comparisonId } = req.params;
            const { choice, reason } = req.body;
            const userId = req.user.id;

            const comparison = await MovieComparison.findById(comparisonId);
            if (!comparison) {
                return res.status(404).json({ message: 'Comparison not found' });
            }

            // Check if user has already voted
            const existingVote = comparison.votes.find(vote => 
                vote.userId.toString() === userId
            );

            if (existingVote) {
                return res.status(400).json({ message: 'You have already voted' });
            }

            comparison.votes.push({
                userId,
                choice,
                reason
            });

            await comparison.save();
            res.status(200).json(comparison);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get movie statistics
    getMovieStats: async (req, res) => {
        try {
            const { movieId } = req.params;
            const movie = await Movie.findById(movieId);

            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Calculate box office statistics
            const boxOfficeStats = {
                budget: movie.budget,
                revenue: movie.revenue,
                profit: movie.revenue - movie.budget,
                productionTime: movie.productionTime || 'Not available'
            };

            // Get genre-based comparisons
            const genreComparisons = await MovieComparison.find({
                $or: [
                    { movie1: movieId },
                    { movie2: movieId }
                ],
                category: 'genre'
            }).populate('movie1').populate('movie2');

            res.status(200).json({
                boxOfficeStats,
                genreComparisons
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get trending comparisons
    getTrendingComparisons: async (req, res) => {
        try {
            const comparisons = await MovieComparison.find()
                .populate('movie1')
                .populate('movie2')
                .sort({ 'votes.length': -1 })
                .limit(10);

            res.status(200).json(comparisons);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = movieComparisonController; 