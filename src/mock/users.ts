// Mock Users Data
import { User } from '../types/domain';

export const MOCK_USERS: Record<string, User> = {
  'user-001': {
    id: 'user-001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phoneNumber: '+1-555-0101',
    profileImage:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=John&mode=light',
    role: 'user',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-01'),
  },
  'user-002': {
    id: 'user-002',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    phoneNumber: '+1-555-0102',
    profileImage:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane&mode=light',
    role: 'admin',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-02-05'),
  },
  'user-003': {
    id: 'user-003',
    email: 'bob.johnson@example.com',
    name: 'Bob Johnson',
    role: 'user',
    status: 'active',
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
};

export const MOCK_CURRENT_USER: User = MOCK_USERS['user-001'];

export const MOCK_ADMIN_USER = MOCK_USERS['user-002'];
