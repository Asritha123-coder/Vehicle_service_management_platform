import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('[AuthContext] Token from localStorage:', token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('[AuthContext] Decoded token:', decoded);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.warn('[AuthContext] Token expired:', decoded.exp, Date.now());
          logout();
        } else {
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log('[AuthContext] Parsed user from localStorage:', parsedUser);
              setUser(parsedUser);
            } catch (parseErr) {
              console.error('[AuthContext] Failed to parse user:', parseErr);
              logout();
            }
          } else {
            console.warn('[AuthContext] No user found in localStorage');
            logout();
          }
        }
      } catch (error) {
        console.error('[AuthContext] Failed to decode token:', error);
        logout();
      }
    } else {
      console.warn('[AuthContext] No token found in localStorage');
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
