# CineHub - Fullstack Movie Website Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Setup and Installation](#setup-and-installation)
6. [API Documentation](#api-documentation)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Security](#security)
10. [Deployment](#deployment)

## Project Overview
CineHub is a full-stack responsive movie website that allows users to browse, search, and discover movies. The application provides a modern and user-friendly interface for movie enthusiasts to explore their favorite films and TV shows.

## Technology Stack
### Frontend
- React.js (Create React App)
- Material UI for styling
- React Router for navigation
- Formik & Yup for form handling and validation
- Axios for API requests
- Swiper for carousel/slider components

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for request validation

### External APIs
- TheMovieDB API for movie data

## Project Structure
```
fullstack-mern-movie-2022/
├── client/                 # Frontend React application
│   ├── src/               # Source code
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── src/              # Source code
│   └── package.json      # Backend dependencies
└── README.md             # Project documentation
```

## Features
1. User Authentication
   - User registration and login
   - JWT-based authentication
   - Protected routes

2. Movie Discovery
   - Browse popular movies
   - Search functionality
   - Movie details view
   - Responsive design for all devices

3. User Experience
   - Modern and intuitive UI
   - Smooth navigation
   - Loading states and error handling
   - Responsive design

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- TheMovieDB API key

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with required environment variables
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with required environment variables
4. Start the server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Movie Endpoints
- GET /api/movies/popular - Get popular movies
- GET /api/movies/search - Search movies
- GET /api/movies/:id - Get movie details

## Frontend Architecture
The frontend is built using React.js and follows a component-based architecture. Key features include:
- Responsive design using Material UI
- Form handling with Formik and Yup
- State management using React hooks
- API integration using Axios
- Protected routes using React Router

## Backend Architecture
The backend is built using Node.js and Express.js, featuring:
- RESTful API design
- MongoDB database with Mongoose ODM
- JWT authentication
- Input validation using Express Validator
- Error handling middleware

## Security
- JWT-based authentication
- Password hashing
- Input validation
- CORS configuration
- Environment variables for sensitive data

## Deployment
The application can be deployed using:
- Frontend: Vercel, Netlify, or any static hosting service
- Backend: Heroku, DigitalOcean, or any Node.js hosting service
- Database: MongoDB Atlas

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 

