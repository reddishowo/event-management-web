import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/router';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const { data } = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setToken(token);

      // Redirect based on user role after token verification
      if (data.is_admin) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Pastikan email dan password tidak kosong
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
  
      const { data } = await api.post('/login', { email, password });
      
      if (!data.token) {
        throw new Error('No authentication token received');
      }
  
      // Simpan token
      localStorage.setItem('token', data.token);
      setToken(data.token);
  
      // Fetch user details dengan token baru
      const userResponse = await api.get('/user', {
        headers: { Authorization: `Bearer ${data.token}` }
      });
  
      const userData = userResponse.data;
      setUser(userData);
  
      // Debug log
      console.log('User Data:', userData);
      console.log('Is Admin:', userData.is_admin);
  
      // Redirect berdasarkan peran
      if (userData.is_admin) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
  
      return userData; // Kembalikan data user
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Hapus token dan user data jika login gagal
      logout();
      
      // Lempar error agar bisa ditangkap di komponen Login
      throw error;
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/register', { name, email, password });
      console.log("Register response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};