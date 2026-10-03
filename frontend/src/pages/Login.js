import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import apiMessage from '../i18n/apiMessage';

import { useAuth } from '../context/AuthContext';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useTranslation('pages');
  const { login } = useAuth();
  const navigate = useNavigate();
  const lp = useLocalizedPath();

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
      navigate(lp('home'));
    } catch (error) {
      setMessage(error.response?.data?.error || 'generic.error');
    }
  };

  return (
    <div className="min-h-screen bg-primary/60 flex items-center justify-center p-4">
      <div className="bg-secondary p-8 rounded-md border border-secondary/30 shadow-sm w-full max-w-lg">
        <h1 className="font-display text-2xl font-semibold mb-2 text-center">{t("auth.loginTitle")}</h1>
        <div className="divider-gold mb-6" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-2">{t("auth.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium mb-2">{t("auth.password")}</label>
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
              {t("auth.loginButton")}
            </button>
          </div>
        </form>
        {message && (
          <p className="bg-ink text-ivory rounded-md p-4 mt-4 text-center">
            {apiMessage(message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
