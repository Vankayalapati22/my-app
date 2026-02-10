// Subscription Service Contracts
import { Subscription, SubscriptionPlan, Payment } from '../../types/domain';
import {
  SubscribeRequest,
  SubscribeResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetPaymentHistoryResponse,
} from '../../types/dto';

export interface ISubscriptionService {
  /**
   * Get all available subscription plans
   */
  getPlans(): Promise<SubscriptionPlan[]>;

  /**
   * Get specific plan details
   */
  getPlanById(planId: string): Promise<SubscriptionPlan>;

  /**
   * Get current subscription for user
   */
  getUserSubscription(userId: string): Promise<Subscription | null>;

  /**
   * Subscribe to a plan
   */
  subscribe(userId: string, request: SubscribeRequest): Promise<SubscribeResponse>;

  /**
   * Cancel subscription
   */
  cancelSubscription(subscriptionId: string): Promise<void>;

  /**
   * Upgrade subscription to different plan
   */
  upgradePlan(subscriptionId: string, newPlanId: string): Promise<Subscription>;

  /**
   * Downgrade subscription to different plan
   */
  downgradePlan(subscriptionId: string, newPlanId: string): Promise<Subscription>;

  /**
   * Renew subscription
   */
  renewSubscription(subscriptionId: string): Promise<Subscription>;

  /**
   * Check if subscription is active
   */
  isSubscriptionActive(userId: string): Promise<boolean>;

  /**
   * Process payment
   */
  processPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;

  /**
   * Get payment history for user
   */
  getPaymentHistory(userId: string, page?: number, pageSize?: number): Promise<GetPaymentHistoryResponse>;

  /**
   * Get payment details
   */
  getPaymentById(paymentId: string): Promise<Payment>;

  /**
   * Refund payment
   */
  refundPayment(paymentId: string, reason: string): Promise<Payment>;
}
