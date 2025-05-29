import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Change this to your backend URL
  withCredentials: true, // If you're using cookies for auth
});

export default instance;
