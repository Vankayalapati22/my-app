// Notification Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types/domain';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Get notifications
    getNotificationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getNotificationsSuccess: (
      state,
      action: PayloadAction<{ notifications: Notification[]; unreadCount: number }>
    ) => {
      state.isLoading = false;
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    getNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Mark as read
    markAsReadSuccess: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Mark all as read
    markAllAsReadSuccess: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },

    // Add new notification (real-time)
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },

    // Delete notification
    deleteNotificationSuccess: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getNotificationsStart,
  getNotificationsSuccess,
  getNotificationsFailure,
  markAsReadSuccess,
  markAllAsReadSuccess,
  addNotification,
  deleteNotificationSuccess,
  clearError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
