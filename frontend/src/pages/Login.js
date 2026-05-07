import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import api from '../api/axios';

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 login แล้ว → เด้ง dashboard
  if (localStorage.getItem('token')) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const res = await api.post('/auth/login', form);

      if (res.data.success) {

        // 🔥 save token
        localStorage.setItem(
          'token',
          res.data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(res.data.user)
        );

        // 🔥 redirect
        navigate('/dashboard');
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Login failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-[350px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-500 p-3 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e)=>setForm({
            ...form,
            username: e.target.value
          })}
          className="w-full border p-3 rounded mb-4"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e)=>setForm({
            ...form,
            password: e.target.value
          })}
          className="w-full border p-3 rounded mb-5"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

      </form>

    </div>
  );
}