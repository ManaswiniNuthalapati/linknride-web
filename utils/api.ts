import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // backend endpoint
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
