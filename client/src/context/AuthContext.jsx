import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // check if student has existing session cookie on first load
  const checkAuth = useCallback(async () => {
    try {
      const data = await api.auth.me();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // login action
  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    setUser(data.user);
    addToast(data.message || 'Logged in successfully', 'success');
    return data.user;
  };

  // register action
  const register = async (userData) => {
    const data = await api.auth.register(userData);
    setUser(data.user);
    addToast(data.message || 'Account created successfully', 'success');
    return data.user;
  };

  // logout action
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      // chill if network fails
    }
    setUser(null);
    addToast('Logged out. See you next practical!', 'info');
  };

  // fast switch demo user for testing interactions
  const switchDemoUser = async (email, password = 'student123') => {
    try {
      const data = await api.auth.login({ email, password });
      setUser(data.user);
      addToast(`Switched active student to ${data.user.name}`, 'success');
      return data.user;
    } catch (err) {
      addToast(err.message || 'Failed to switch user', 'error');
      throw err;
    }
  };

  // refresh profile after editing
  const refreshUser = async () => {
    try {
      const data = await api.auth.me();
      setUser(data.user);
    } catch (err) {
      // chill
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchDemoUser,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
