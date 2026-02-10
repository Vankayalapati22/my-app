// Subscription Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '@store/index';
import {
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
} from '@store/slices/subscription.slice';
import { subscriptionService } from '@services/subscription';
import type { SubscribeRequest } from '../types/dto';

export function useSubscription() {
  const dispatch = useDispatch<AppDispatch>();
  const subscription = useSelector((state: RootState) => state.subscription);

  // Get plans
  const getPlans = useCallback(async () => {
    dispatch(getPlansStart());
    try {
      const plans = await subscriptionService.getPlans();
      dispatch(getPlansSuccess(plans));
      return { success: true, data: plans };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch plans';
      dispatch(getPlansFailure(message));
      return { success: false, error: message };
    }
  }, [dispatch]);

  // Get user subscription
  const getSubscription = useCallback(
    async (userId: string) => {
      dispatch(getSubscriptionStart());
      try {
        const sub = await subscriptionService.getUserSubscription(userId);
        dispatch(getSubscriptionSuccess(sub));
        return { success: true, data: sub };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch subscription';
        dispatch(getSubscriptionFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Subscribe
  const subscribe = useCallback(
    async (userId: string, request: SubscribeRequest) => {
      dispatch(subscribeStart());
      try {
        const result = await subscriptionService.subscribe(userId, request);
        dispatch(subscribeSuccess(result.subscription));
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Subscription failed';
        dispatch(subscribeFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Cancel subscription
  const cancelSubscription = useCallback(
    async (subscriptionId: string) => {
      dispatch(cancelSubscriptionStart());
      try {
        await subscriptionService.cancelSubscription(subscriptionId);
        dispatch(cancelSubscriptionSuccess());
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Cancellation failed';
        dispatch(cancelSubscriptionFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Get payment history
  const getPaymentHistory = useCallback(
    async (userId: string) => {
      try {
        const result = await subscriptionService.getPaymentHistory(userId);
        dispatch(getPaymentHistorySuccess(result.payments));
        return { success: true, data: result.payments };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch payment history';
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Clear error
  const clearSubscriptionError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...(subscription as unknown as Record<string, unknown>),
    getPlans,
    getSubscription,
    subscribe,
    cancelSubscription,
    getPaymentHistory,
    clearError: clearSubscriptionError,
  };
}
