import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage on load (persists within tab, not across close)
    const storedUser = sessionStorage.getItem('rfid_user');
    const token = sessionStorage.getItem('rfid_access_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken } = response.data;

    // Access token in sessionStorage (cleared on tab close - more secure)
    sessionStorage.setItem('rfid_access_token', accessToken);
    sessionStorage.setItem('rfid_user', JSON.stringify(user));
    // Refresh token is set as httpOnly cookie by server
    setUser(user);
    return user;
  };

  // Called after Google OAuth callback
  const loginWithToken = (accessToken, userData) => {
    sessionStorage.setItem('rfid_access_token', accessToken);
    sessionStorage.setItem('rfid_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Revoke refresh token on server
    } catch (_) {
      // Ignore errors on logout
    }
    sessionStorage.removeItem('rfid_access_token');
    sessionStorage.removeItem('rfid_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithToken, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
