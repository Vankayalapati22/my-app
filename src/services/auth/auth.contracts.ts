// Service Contracts - Define stable interfaces that UI will use
// Implementation can change (Mock -> API) but interface stays the same

import { User, AuthToken } from '../../types/domain';
import { LoginRequest, RegisterRequest, ChangePasswordRequest, ResetPasswordRequest } from '../../types/dto';

export interface IAuthService {
  /**
   * Authenticate user with email and password
   * Returns user and tokens on success
   */
  login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthToken }>;

  /**
   * Register new user
   * Returns newly created user and tokens
   */
  register(data: RegisterRequest): Promise<{ user: User; tokens: AuthToken }>;

  /**
   * Refresh access token using refresh token
   */
  refreshToken(refreshToken: string): Promise<AuthToken>;

  /**
   * Logout user and invalidate tokens
   */
  logout(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Request password reset email
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Verify password reset token
   */
  verifyResetToken(token: string): Promise<boolean>;

  /**
   * Reset password with token
   */
  resetPassword(data: ResetPasswordRequest): Promise<void>;

  /**
   * Change password for authenticated user
   */
  changePassword(data: ChangePasswordRequest): Promise<void>;

  /**
   * Request email change with verification
   */
  requestChangeEmail(newEmail: string): Promise<void>;

  /**
   * Verify new email with OTP
   */
  verifyChangeEmail(otp: string): Promise<void>;

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<void>;
}

export interface IUserService {
  /**
   * Get user profile by ID
   */
  getProfile(userId: string): Promise<User>;

  /**
   * Update user profile
   */
  updateProfile(userId: string, data: Partial<User>): Promise<User>;

  /**
   * Verify phone number with OTP
   */
  verifyPhoneNumber(phoneNumber: string, otp: string): Promise<User>;

  /**
   * Resend email verification
   */
  resendEmailVerification(email: string): Promise<void>;

  /**
   * Suspend user account
   */
  suspendAccount(userId: string): Promise<void>;

  /**
   * Reactivate suspended account
   */
  reactivateAccount(userId: string): Promise<void>;

  /**
   * Get user settings
   */
  getSettings(userId: string): Promise<Record<string, unknown>>;

  /**
   * Update user settings
   */
  updateSettings(userId: string, settings: Record<string, unknown>): Promise<Record<string, unknown>>;
}
