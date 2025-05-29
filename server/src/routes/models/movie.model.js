import mongoose from 'mongoose';
import  modelOptions  from './model.options.js';

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    posterPath: {
        type: String,
        required: true
    },
    backdropPath: {
        type: String
    },
    releaseDate: {
        type: Date
    },
    runtime: {
        type: Number
    },
    genres: [{
        type: String
    }],
    voteAverage: {
        type: Number
    },
    voteCount: {
        type: Number
    },
    language: {
        type: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'now_playing', 'released'],
        default: 'upcoming'
    },
    showtimes: [{
        time: {
            type: Date,
            required: true
        },
        seats: [{
            row: {
                type: String,
                required: true
            },
            number: {
                type: Number,
                required: true
            },
            isBooked: {
                type: Boolean,
                default: false
            }
        }]
    }]
}, modelOptions);

movieSchema.index({ tmdbId: 1 });
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie; 