// Domain Models - Core business entities

// Identity & Access Bounded Context
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  profileImage?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegistrationData = {
  email: string;
  password: string;
  name: string;
};

export type ResetPasswordData = {
  token: string;
  newPassword: string;
};

// Subscription & Billing Bounded Context
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  features: string[];
  maxConcurrentStreams: number;
  maxDownloads: number;
  videoQuality: 'SD' | 'HD' | '4K';
  isActive: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'applepay' | 'googlepay';
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Media Catalog Bounded Context
export interface Media {
  id: string;
  title: string;
  description: string;
  type: 'song' | 'movie' | 'podcast' | 'audiobook';
  artist?: string;
  director?: string;
  genre: string[];
  duration: number; // in seconds
  releaseDate: Date;
  thumbnailUrl: string;
  posterUrl?: string;
  rating: number; // 0-5
  totalViews: number;
  isExplicit: boolean;
  isApproved: boolean;
  uploadedBy: string;
  uploadedAt: Date;
  quality: MediaQuality[];
}

export interface MediaQuality {
  resolution: string; // '480p', '720p', '1080p', etc.
  format: string; // 'mp4', 'webm', etc.
  bitrate: string;
  fileSize: number;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  coverImage?: string;
}

export interface PlaylistAggregate {
  id: string;
  userId: string;
  name: string;
  description: string;
  isPublic: boolean;
  mediaIds: string[];
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

// Media Upload & Moderation Bounded Context
export interface MediaUpload {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  status: 'uploaded' | 'processing' | 'approved' | 'rejected' | 'failed';
  uploadProgress: number; // 0-100
  mediaId?: string;
  metadata: MediaMetadata;
  uploadedAt: Date;
  processedAt?: Date;
}

export interface MediaMetadata {
  title: string;
  description: string;
  genre: string[];
  duration: number;
  artist?: string;
  language: string;
  contentRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
}

export interface ModerationResult {
  id: string;
  uploadId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  flags: ModerationFlag[];
}

export interface ModerationFlag {
  type: 'adult' | 'violence' | 'hate_speech' | 'copyright' | 'spam';
  confidence: number; // 0-1
  description: string;
}

// Streaming Bounded Context
export interface StreamingSession {
  id: string;
  userId: string;
  mediaId: string;
  deviceId: string;
  status: 'active' | 'paused' | 'completed' | 'stopped';
  currentPosition: number; // in seconds
  quality: string; // '480p', '720p', etc.
  startTime: Date;
  endTime?: Date;
  totalWatchTime: number; // in seconds
}

export interface ViewingHistory {
  id: string;
  userId: string;
  mediaId: string;
  watchedAt: Date;
  watchDuration: number;
  completionPercentage: number;
}

// Notification & Sharing Bounded Context
export interface Notification {
  id: string;
  userId: string;
  type:
    | 'subscription_expiry'
    | 'media_approved'
    | 'media_rejected'
    | 'payment_received'
    | 'new_content'
    | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface Share {
  id: string;
  mediaId: string;
  sharedBy: string;
  sharedWith: string[];
  message?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  mediaId: string;
  mediaType: 'song' | 'movie' | 'podcast' | 'audiobook';
  createdAt: Date;
}

// Common Value Objects
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: Date;
}

export interface SearchFilter {
  query?: string;
  genre?: string[];
  type?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  rating?: {
    min: number;
    max: number;
  };
  page: number;
  pageSize: number;
  sortBy?: 'relevance' | 'date' | 'views' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
