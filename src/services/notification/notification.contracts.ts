// Notification Service Contracts
import { Notification } from '../../types/domain';
import { GetNotificationsResponse } from '../../types/dto';

export interface INotificationService {
  /**
   * Get user notifications
   */
  getNotifications(userId: string, page?: number, pageSize?: number): Promise<GetNotificationsResponse>;

  /**
   * Get unread count
   */
  getUnreadCount(userId: string): Promise<number>;

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * Mark all as read
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Promise<void>;

  /**
   * Subscribe to real-time notifications
   */
  subscribe(userId: string, callback: (notification: Notification) => void): () => void;

  /**
   * Send notification
   */
  sendNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
}
