import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { email, pwd: password });
      setMessage(response.data.message);
      const userId = response.data.userId;
      const userRang = response.data.rang;
      const userToken = response.data.token;
      login(userRang, userToken, userId);
      navigate('/');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-primary/60 flex items-center justify-center p-4">
      <div className="bg-secondary p-8 rounded-md border border-secondary/30 shadow-sm w-full max-w-lg">
        <h1 className="font-display text-2xl font-semibold mb-2 text-center">Bejelentkezés</h1>
        <div className="divider-gold mb-6" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Email cím:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium mb-2">Jelszó:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="btn-brand w-full">
              Bejelentkezés
            </button>
          </div>
        </form>
        {message && (
          <p className="bg-ink text-ivory rounded-md p-4 mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
