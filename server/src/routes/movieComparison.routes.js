const express = require('express');
const movieComparisonController = require('../controllers/movieComparison.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/trending', movieComparisonController.getTrendingComparisons);
router.get('/stats/:movieId', movieComparisonController.getMovieStats);
router.get('/:id', movieComparisonController.getComparison);

// Protected routes
router.use(authenticate);
router.post('/', movieComparisonController.createComparison);
router.post('/:comparisonId/vote', movieComparisonController.vote);

module.exports = router; 