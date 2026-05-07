import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});


// 🔥 attach token
api.interceptors.request.use(config => {

  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// 🔥 auto logout if token expired
api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;