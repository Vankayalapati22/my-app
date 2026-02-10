// Auth Service Implementation using Mock Data
import { IAuthService } from './auth.contracts';
import { User, AuthToken } from '../../types/domain';
import { LoginRequest, RegisterRequest, ChangePasswordRequest, ResetPasswordRequest } from '../../types/dto';
import { MOCK_USERS, MOCK_CURRENT_USER } from '@mock/users';
import { generateMockToken } from '@lib/auth-utils';

class AuthService implements IAuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthToken }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email
    const user = Object.values(MOCK_USERS).find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new Error('Account has been suspended');
    }

    // Generate mock tokens
    const tokens = generateMockToken(user.id);

    this.currentUser = user;

    // Store in localStorage (in real app, use secure HttpOnly cookie)
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      user,
      tokens,
    };
  }

  async register(data: RegisterRequest): Promise<{ user: User; tokens: AuthToken }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    const existingUser = Object.values(MOCK_USERS).find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      role: 'user',
      status: 'active',
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real app, this would be created in database
    MOCK_USERS[newUser.id] = newUser;

    // Generate tokens
    const tokens = generateMockToken(newUser.id);

    this.currentUser = newUser;

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    }

    return {
      user: newUser,
      tokens,
    };
  }

  async refreshToken(_refreshToken: string): Promise<AuthToken> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!this.currentUser) {
      throw new Error('No active session');
    }

    const newTokens = generateMockToken(this.currentUser.id);
    // Tokens updated in service

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', newTokens.accessToken);
      localStorage.setItem('refreshToken', newTokens.refreshToken);
    }

    return newTokens;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.currentUser = null;
    // Clear auth state

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.currentUser) {
      return this.currentUser;
    }

    // Check localStorage for persisted user
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser as User;
      }
    }

    // Return mock user for demo purposes
    this.currentUser = MOCK_CURRENT_USER;
    return MOCK_CURRENT_USER;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = Object.values(MOCK_USERS).find((u) => u.email === email);
    if (!user) {
      // Don't reveal if email exists for security
      return;
    }

    // In real app, send email with reset token
    // Password reset email sent
  }

  async verifyResetToken(token: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // In real app, validate token
    return !!token;
  }

  async resetPassword(_data: ResetPasswordRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, update password in database
    // Password reset successful
  }

  async changePassword(_data: ChangePasswordRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // In real app, verify current password and update
    // Password changed successfully
  }

  async requestChangeEmail(newEmail: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if email already in use
    const exists = Object.values(MOCK_USERS).find((u) => u.email === newEmail);
    if (exists) {
      throw new Error('Email already in use');
    }

    // In real app, send verification email
    // Email change verification sent
  }

  async verifyChangeEmail(_otp: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // In real app, verify OTP and update email
    // Email changed successfully
  }

  async verifyEmail(_token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    this.currentUser.emailVerified = true;
    this.currentUser.updatedAt = new Date();

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(this.currentUser));
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
