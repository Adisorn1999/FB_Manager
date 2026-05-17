import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
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

     const status = error.response?.status;
    const requestUrl = (error.config?.url || '').toString();
    const isAuthLoginRequest = requestUrl.includes('/auth/login');

    if (status === 401 && !isAuthLoginRequest) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;