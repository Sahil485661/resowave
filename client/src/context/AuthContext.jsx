import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getMe } from '@/api/auth.api';
import { Disc3 } from 'lucide-react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'spotify_user_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bootstrapping: Verify HTTP-Only JWT Cookie on initial mount
  useEffect(() => {
    let isMounted = true;
    async function bootstrapSession() {
      try {
        const data = await getMe();
        if (isMounted && data?.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        }
      } catch {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    bootstrapSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to 401 unauthorized events to clean up session
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('resowave_token');
    };

    window.addEventListener('spotify:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('spotify:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        if (data.token) localStorage.setItem('resowave_token', data.token);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await registerUser(payload);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        if (data.token) localStorage.setItem('resowave_token', data.token);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('resowave_token');
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    isLoading: loading,
    role: user?.role,
    isArtist: user?.role === 'artist',
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUser,
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#121212] select-none">
        <img src="/favicon.png" alt="Resowave" className="h-16 w-16 rounded-2xl animate-pulse shadow-lg" />
        <span className="mt-4 text-xs font-bold uppercase tracking-widest text-spotify-subtext animate-pulse">
          Connecting to Resowave...
        </span>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
