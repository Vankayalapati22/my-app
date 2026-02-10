// Auth Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthToken } from '../../types/domain';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  tokens: AuthToken | null;
  emailVerificationStep: 'none' | 'pending' | 'verified';
  phoneVerificationStep: 'none' | 'pending' | 'verified';
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  tokens: null,
  emailVerificationStep: 'none',
  phoneVerificationStep: 'none',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginStart: (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state: AuthState, action: PayloadAction<{ user: User; tokens: AuthToken }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Register
    registerStart: (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state: AuthState, action: PayloadAction<{ user: User; tokens: AuthToken }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state: AuthState) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.emailVerificationStep = 'none';
      state.phoneVerificationStep = 'none';
    },

    // Email verification
    emailVerificationPending: (state: AuthState) => {
      state.emailVerificationStep = 'pending';
    },
    emailVerificationSuccess: (state: AuthState) => {
      state.emailVerificationStep = 'verified';
      if (state.user) {
        state.user.emailVerified = true;
      }
    },

    // Phone verification
    phoneVerificationPending: (state: AuthState) => {
      state.phoneVerificationStep = 'pending';
    },
    phoneVerificationSuccess: (state: AuthState) => {
      state.phoneVerificationStep = 'verified';
      if (state.user) {
        state.user.phoneVerified = true;
      }
    },

    // Set current user from storage
    setCurrentUser: (state: AuthState, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // Clear error
    clearError: (state: AuthState) => {
      state.error = null;
    },

    // Update tokens
    updateTokens: (state: AuthState, action: PayloadAction<AuthToken>) => {
      state.tokens = action.payload;
    },

    // Update user profile
    updateProfile: (state: AuthState, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  emailVerificationPending,
  emailVerificationSuccess,
  phoneVerificationPending,
  phoneVerificationSuccess,
  setCurrentUser,
  clearError,
  updateTokens,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;
