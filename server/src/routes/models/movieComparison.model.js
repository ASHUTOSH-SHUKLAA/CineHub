const mongoose = require('mongoose');

const movieComparisonSchema = new mongoose.Schema({
    movie1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    movie2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    category: {
        type: String,
        enum: ['boxOffice', 'genre'],
        required: true
    },
    votes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        choice: {
            type: String,
            enum: ['movie1', 'movie2']
        },
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MovieComparison', movieComparisonSchema); 