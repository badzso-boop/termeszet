import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Minden admin/user API hívás (axios) ezt a defaultot használja Authorization headerként --
// így nem kell minden egyes hívóhelyet külön megírni, a backend verifyToken/verifyAdmin
// middleware-je pedig ténylegesen ezt a JWT-t olvassa (nem a request body-t).
const applyAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [rang, setRang] = useState(localStorage.getItem('rang'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    applyAuthHeader(token);
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('userId'));
      setRang(localStorage.getItem('rang'));
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userRang, userToken, userId) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('rang', userRang);
    localStorage.setItem('token', userToken);
    setUserId(userId);
    setRang(userRang);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.clear();
    setUserId(null)
    setRang(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ userId, rang, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
