import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isLoggedIn, user]);

  // Donor login
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setIsLoggedIn(true);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setError(null);
        return { ok: true };
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
        setError(data.msg || 'Login failed');
        return { ok: false, error: data.msg };
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      setError('Server error');
      return { ok: false, error: 'Server error' };
    }
  };

  // Hospital login
  const hospitalLogin = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/hospital/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setIsLoggedIn(true);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setError(null);
        return { ok: true };
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
        setError(data.msg || 'Hospital login failed');
        return { ok: false, error: data.msg };
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      setError('Server error');
      return { ok: false, error: 'Server error' };
    }
  };

  // Blood Bank login
  const bloodBankLogin = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/bloodbank/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setIsLoggedIn(true);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setError(null);
        return { ok: true };
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
        setError(data.msg || 'Blood Bank login failed');
        return { ok: false, error: data.msg };
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      setError('Server error');
      return { ok: false, error: 'Server error' };
    }
  };

  // Logout
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    isLoggedIn,
    user,
    error,
    login,
    hospitalLogin,
    bloodBankLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

