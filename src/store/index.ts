// Redux Store Setup
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import mediaReducer from './slices/media.slice';
import subscriptionReducer from './slices/subscription.slice';
import notificationReducer from './slices/notification.slice';
import uploadReducer from './slices/upload.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer,
    subscription: subscriptionReducer,
    notification: notificationReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setCurrentUser'],
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
