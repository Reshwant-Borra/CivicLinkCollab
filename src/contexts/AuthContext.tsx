import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'voter' | 'organizer' | 'ambassador' | 'admin';
  preferredLanguage: string;
  community?: string;
  profile?: {
    ambassadorPoints?: number;
    trainingProgress?: any[];
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    preferredLanguage?: string;
    community?: string;
    zipCode?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isAmbassador: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          apiClient.setToken(token);
          const response = await apiClient.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('authToken');
          apiClient.setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    preferredLanguage?: string;
    community?: string;
    zipCode?: string;
  }) => {
    try {
      const response = await apiClient.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.logout();
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await apiClient.updateProfile(profileData);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
    isAmbassador: user?.role === 'ambassador' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};