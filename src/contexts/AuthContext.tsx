import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, getUser, isLoggedIn } from '@/lib/api';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  karma: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register';
  setAuthModalView: (view: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        if (isLoggedIn()) {
          const userData = getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const login = async (username: string, password: string) => {
    try {
      const userData = await authAPI.login({ username, password });
      setUser(userData);
      closeAuthModal();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  const register = async (username: string, email: string, password: string) => {
    try {
      const userData = await authAPI.register({ username, email, password });
      setUser(userData);
      closeAuthModal();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };
  
  const logout = () => {
    authAPI.logout();
    setUser(null);
  };
  
  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalView,
        setAuthModalView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
