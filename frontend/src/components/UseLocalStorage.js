import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
  const [value, setValue] = useState(() => localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = () => {
      setValue(localStorage.getItem(key));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return value;
};

export default useLocalStorage;
