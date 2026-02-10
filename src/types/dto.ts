// API Request/Response DTOs

import { User, Media, Subscription, Payment, MediaUpload } from './domain';

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// User DTOs
export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  otp?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Media DTOs
export interface GetMediaListRequest {
  page?: number;
  pageSize?: number;
  genre?: string;
  search?: string;
  sortBy?: 'date' | 'views' | 'rating';
  type?: 'song' | 'movie' | 'podcast' | 'audiobook';
}

export interface GetMediaResponse {
  data: Media[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateMediaRequest {
  title: string;
  description: string;
  type: 'song' | 'movie' | 'podcast' | 'audiobook';
  artist?: string;
  director?: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  isExplicit: boolean;
  language: string;
}

export interface UpdateMediaRequest {
  title?: string;
  description?: string;
  genre?: string[];
  isExplicit?: boolean;
}

// Subscription DTOs
export interface GetSubscriptionPlansResponse {
  plans: SubscriptionPlanDTO[];
}

export interface SubscriptionPlanDTO {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  features: string[];
  maxConcurrentStreams: number;
  maxDownloads: number;
  videoQuality: 'SD' | 'HD' | '4K';
}

export interface SubscribeRequest {
  planId: string;
  paymentMethodId: string;
}

export interface SubscribeResponse {
  subscription: Subscription;
  payment: Payment;
}

// Payment DTOs
export interface CreatePaymentRequest {
  subscriptionId: string;
  amount: number;
  paymentMethod: 'card' | 'paypal' | 'applepay' | 'googlepay';
  paymentToken: string;
}

export interface CreatePaymentResponse {
  payment: Payment;
  redirectUrl?: string;
}

export interface GetPaymentHistoryResponse {
  payments: Payment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Upload DTOs
export interface InitiateUploadRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
  metadata: {
    title: string;
    description: string;
    genre: string[];
    artist?: string;
    duration: number;
    language: string;
    contentRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  };
}

export interface InitiateUploadResponse {
  uploadId: string;
  uploadUrl: string;
  uploadToken: string;
}

export interface CompleteUploadRequest {
  uploadId: string;
  uploadToken: string;
}

export interface CompleteUploadResponse {
  media: Media;
  upload: MediaUpload;
}

export interface GetUploadHistoryResponse {
  uploads: MediaUpload[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Search DTOs
export interface SearchRequest {
  query: string;
  type?: 'song' | 'movie' | 'podcast' | 'audiobook' | 'artist' | 'category';
  page?: number;
  pageSize?: number;
  filters?: {
    genre?: string[];
    dateRange?: { from: string; to: string };
    rating?: { min: number; max: number };
  };
}

export interface SearchResponse {
  results: Media[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  executionTime: number; // in milliseconds
}

// Streaming DTOs
export interface StartStreamRequest {
  mediaId: string;
  quality?: '480p' | '720p' | '1080p';
  deviceId: string;
}

export interface StartStreamResponse {
  sessionId: string;
  streamUrl: string;
  duration: number;
  currentPosition: number;
}

export interface UpdateStreamProgressRequest {
  currentPosition: number;
  quality: string;
}

export interface EndStreamRequest {
  reason: 'completed' | 'paused' | 'stopped';
  watchDuration: number;
}

// Notification DTOs
export interface GetNotificationsResponse {
  notifications: NotificationDTO[];
  unreadCount: number;
}

export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface MarkNotificationAsReadRequest {
  notificationId: string;
}

// Admin DTOs
export interface GetUsersResponse {
  users: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SuspendUserRequest {
  reason: string;
}

export interface GetModerationQueueResponse {
  uploads: MediaUpload[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewMediaRequest {
  uploadId: string;
  status: 'approved' | 'rejected';
  reason?: string;
}

export interface GetAnalyticsResponse {
  totalUsers: number;
  activeSubscriptions: number;
  totalMediaCount: number;
  totalStreams: number;
  revenue: {
    today: number;
    thisMonth: number;
    thisYear: number;
  };
  topTrendingMedia: Media[];
}
