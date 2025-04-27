import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

// Define action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Define initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'volunteer' | 'ngo'
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL
const API_URL = 'http://localhost:5000/api';

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if token exists and load user
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: res.data.data, token: state.token },
          });
        } catch (err) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired, please login again' });
        }
      }
    };

    loadUser();
  }, [state.token]);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });

      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data.data,
      });
    } catch (err: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: err.response?.data?.message || 'Login failed',
      });
    }
  };

  // Register user
  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'volunteer' | 'ngo'
  ) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });

      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data.data,
      });
    } catch (err: any) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: err.response?.data?.message || 'Registration failed',
      });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};