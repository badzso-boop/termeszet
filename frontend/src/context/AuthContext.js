import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [rang, setRang] = useState(localStorage.getItem('rang'));
  const [token, setToken] = useState(localStorage.getItem('token'));

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
