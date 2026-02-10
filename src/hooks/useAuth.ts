// Auth Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { RootState, AppDispatch } from '@store/index';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  setCurrentUser,
  clearError,
} from '@store/slices/auth.slice';
import { authService } from '@services/auth';
import type { LoginRequest, RegisterRequest } from '../types/dto';
import type { User } from '../types/domain';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // Load user from storage on mount
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        dispatch(setCurrentUser(user));
      } catch (error) {
        console.error('Failed to load current user:', error);
      }
    };

    loadStoredUser();
  }, [dispatch]);

  // Login
  const login = useCallback(
    async (credentials: LoginRequest) => {
      dispatch(loginStart());
      try {
        const { user, tokens } = await authService.login(credentials);
        dispatch(loginSuccess({ user, tokens }));
        return { success: true, user, tokens };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        dispatch(loginFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Register
  const register = useCallback(
    async (data: RegisterRequest) => {
      dispatch(registerStart());
      try {
        const { user, tokens } = await authService.register(data);
        dispatch(registerSuccess({ user, tokens }));
        return { success: true, user, tokens };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        dispatch(registerFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Logout
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
    }
  }, [dispatch]);

  // Clear error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...auth,
    login,
    register,
    logout: handleLogout,
    clearError: clearAuthError,
  };
}

export function useAuthRequired() {
  const auth = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return { isReady: false, isAuthenticated: false, user: null };
  }

  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  return { isReady: true, isAuthenticated: auth.isAuthenticated, user: auth.user };
}

export function useUser() {
  const auth = useAuth();

  const updateProfile = useCallback(
    async (_userId: string, _data: Partial<User>) => {
      try {
        // Implementation would go here
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed';
        return { success: false, error: message };
      }
    },
    []
  );

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    updateProfile,
  };
}
