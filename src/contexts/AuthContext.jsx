import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    if (t === 'null' || t === 'undefined' || !t) return null;
    try {
      const decoded = jwtDecode(t);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        return null;
      }
      return t;
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      setUser({ 
        name: storedName || 'User',
        email: storedEmail || '' 
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken, userName, userEmail) => {
    localStorage.setItem('token', newToken);
    if(userName) localStorage.setItem('userName', userName);
    if(userEmail) localStorage.setItem('userEmail', userEmail);
    setToken(newToken);
    setUser({ 
      name: userName || 'User',
      email: userEmail || ''
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
