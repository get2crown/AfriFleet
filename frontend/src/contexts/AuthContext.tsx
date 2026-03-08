import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, user } = response.data;
      
      setToken(access_token);
      setUser(user);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Auto login after registration
      await login(userData.username, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role) || user.role === 'admin';
    }
    
    return user.role === roles || user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};