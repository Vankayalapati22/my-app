// User Service Implementation
import { IUserService } from './auth.contracts';
import { User } from '../../types/domain';
import { MOCK_USERS } from '@mock/users';

class UserService implements IUserService {
  async getProfile(userId: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = MOCK_USERS[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    return user;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Update allowed fields
    if (data.name) user.name = data.name;
    if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
    if (data.profileImage) user.profileImage = data.profileImage;

    user.updatedAt = new Date();

    return user;
  }

  async verifyPhoneNumber(phoneNumber: string, otp: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!otp || otp.length !== 6) {
      throw new Error('Invalid OTP');
    }

    // In real app, find user by phone and update
    const user = Object.values(MOCK_USERS).find((u) => u.phoneNumber === phoneNumber);
    if (!user) {
      throw new Error('User not found');
    }

    user.phoneVerified = true;
    user.updatedAt = new Date();

    return user;
  }

  async resendEmailVerification(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = Object.values(MOCK_USERS).find((u) => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In real app, send verification email
    // Verification email sent
  }

  async suspendAccount(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    user.status = 'suspended';
    user.updatedAt = new Date();
  }

  async reactivateAccount(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    user.status = 'active';
    user.updatedAt = new Date();
  }

  async getSettings(userId: string): Promise<Record<string, unknown>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = MOCK_USERS[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Return mock settings
    return {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: 'public',
        allowFriendRequests: true,
      },
      preferences: {
        language: 'en',
        theme: 'light',
        autoplay: true,
      },
    };
  }

  async updateSettings(userId: string, settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // In real app, save settings to database
    return settings;
  }
}

export const userService = new UserService();
