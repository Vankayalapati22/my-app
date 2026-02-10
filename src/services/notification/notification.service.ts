// Notification Service Implementation
import { INotificationService } from './notification.contracts';
import { Notification } from '../../types/domain';
import { GetNotificationsResponse } from '../../types/dto';
import { MOCK_NOTIFICATIONS } from '@mock/uploads';

class NotificationService implements INotificationService {
  private notifications: Map<string, Notification> = new Map();
  private subscribers: Map<string, Set<(n: Notification) => void>> = new Map();

  constructor() {
    // Initialize with mock notifications
    MOCK_NOTIFICATIONS.forEach((n) => {
      this.notifications.set(n.id, { ...n });
    });
  }

  async getNotifications(userId: string, page: number = 1, pageSize: number = 10): Promise<GetNotificationsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userNotifications = Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const notifications = userNotifications.slice(start, end).map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    }));

    const unreadCount = userNotifications.filter((n) => !n.read).length;

    return {
      notifications,
      unreadCount,
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return Array.from(this.notifications.values()).filter((n) => n.userId === userId && !n.read).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .forEach((n) => {
        n.read = true;
      });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.notifications.delete(notificationId);
  }

  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }

    this.subscribers.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(userId)?.delete(callback);
    };
  }

  async sendNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<Notification> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      userId,
      createdAt: new Date(),
    };

    this.notifications.set(newNotification.id, newNotification);

    // Notify subscribers
    this.subscribers.get(userId)?.forEach((callback) => {
      callback(newNotification);
    });

    return newNotification;
  }
}

export const notificationService = new NotificationService();
