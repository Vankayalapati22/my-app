// Subscription Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, SubscriptionPlan, Payment } from '../../types/domain';

export interface SubscriptionState {
  currentSubscription: Subscription | null;
  plans: SubscriptionPlan[];
  paymentHistory: Payment[];
  isLoading: boolean;
  error: string | null;
  isProcessingPayment: boolean;
}

const initialState: SubscriptionState = {
  currentSubscription: null,
  plans: [],
  paymentHistory: [],
  isLoading: false,
  error: null,
  isProcessingPayment: false,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Get plans
    getPlansStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPlansSuccess: (state, action: PayloadAction<SubscriptionPlan[]>) => {
      state.isLoading = false;
      state.plans = action.payload;
    },
    getPlansFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get subscription
    getSubscriptionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getSubscriptionSuccess: (state, action: PayloadAction<Subscription | null>) => {
      state.isLoading = false;
      state.currentSubscription = action.payload;
    },
    getSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Subscribe
    subscribeStart: (state) => {
      state.isProcessingPayment = true;
      state.error = null;
    },
    subscribeSuccess: (state, action: PayloadAction<Subscription>) => {
      state.isProcessingPayment = false;
      state.currentSubscription = action.payload;
    },
    subscribeFailure: (state, action: PayloadAction<string>) => {
      state.isProcessingPayment = false;
      state.error = action.payload;
    },

    // Cancel subscription
    cancelSubscriptionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    cancelSubscriptionSuccess: (state) => {
      state.isLoading = false;
      if (state.currentSubscription) {
        state.currentSubscription.status = 'cancelled';
      }
    },
    cancelSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Payment history
    getPaymentHistorySuccess: (state, action: PayloadAction<Payment[]>) => {
      state.paymentHistory = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getPlansStart,
  getPlansSuccess,
  getPlansFailure,
  getSubscriptionStart,
  getSubscriptionSuccess,
  getSubscriptionFailure,
  subscribeStart,
  subscribeSuccess,
  subscribeFailure,
  cancelSubscriptionStart,
  cancelSubscriptionSuccess,
  cancelSubscriptionFailure,
  getPaymentHistorySuccess,
  clearError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
