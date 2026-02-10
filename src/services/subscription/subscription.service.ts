// Subscription Service Implementation
import { ISubscriptionService } from './subscription.contracts';
import { Subscription, SubscriptionPlan, Payment } from '../../types/domain';
import {
  SubscribeRequest,
  SubscribeResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetPaymentHistoryResponse,
} from '../../types/dto';
import { MOCK_SUBSCRIPTION_PLANS, MOCK_SUBSCRIPTIONS, MOCK_PAYMENTS } from '../../mock/subscriptions';

class SubscriptionService implements ISubscriptionService {
  async getPlans(): Promise<SubscriptionPlan[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_SUBSCRIPTION_PLANS;
  }

  async getPlanById(planId: string): Promise<SubscriptionPlan> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const plan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    return plan;
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const subscription = Object.values(MOCK_SUBSCRIPTIONS).find((s) => s.userId === userId);
    return subscription || null;
  }

  async subscribe(userId: string, request: SubscribeRequest): Promise<SubscribeResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const plan = await this.getPlanById(request.planId);

    // Check if user already has active subscription
    const existing = await this.getUserSubscription(userId);
    if (existing && existing.status === 'active') {
      throw new Error('User already has an active subscription');
    }

    // Create subscription
    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId,
      planId: plan.id,
      status: 'active',
      plan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoRenew: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create payment
    const payment: Payment = {
      id: `payment-${Date.now()}`,
      userId,
      subscriptionId: subscription.id,
      amount: plan.pricePerMonth,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'card',
      transactionId: `txn_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in mock data
    MOCK_SUBSCRIPTIONS[subscription.id] = subscription;
    MOCK_PAYMENTS.push(payment);

    return {
      subscription,
      payment,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const subscription = MOCK_SUBSCRIPTIONS[subscriptionId];
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.updatedAt = new Date();
  }

  async upgradePlan(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const subscription = MOCK_SUBSCRIPTIONS[subscriptionId];
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const newPlan = await this.getPlanById(newPlanId);

    // Calculate prorated amount
    subscription.plan = newPlan;
    subscription.planId = newPlanId;
    subscription.updatedAt = new Date();

    return subscription;
  }

  async downgradePlan(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const subscription = MOCK_SUBSCRIPTIONS[subscriptionId];
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const newPlan = await this.getPlanById(newPlanId);

    subscription.plan = newPlan;
    subscription.planId = newPlanId;
    subscription.updatedAt = new Date();

    return subscription;
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const subscription = MOCK_SUBSCRIPTIONS[subscriptionId];
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const now = new Date();
    subscription.status = 'active';
    subscription.startDate = now;
    subscription.endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    subscription.updatedAt = now;

    return subscription;
  }

  async isSubscriptionActive(userId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return false;

    return subscription.status === 'active' && subscription.endDate > new Date();
  }

  async processPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate payment processing
    const payment: Payment = {
      id: `payment-${Date.now()}`,
      userId: '', // From subscription
      subscriptionId: request.subscriptionId,
      amount: request.amount,
      currency: 'USD',
      status: 'completed',
      paymentMethod: request.paymentMethod,
      transactionId: `txn_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_PAYMENTS.push(payment);

    return {
      payment,
    };
  }

  async getPaymentHistory(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<GetPaymentHistoryResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const userPayments = MOCK_PAYMENTS.filter((p) => p.userId === userId);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const payments = userPayments.slice(start, end);

    return {
      payments,
      pagination: {
        page,
        pageSize,
        total: userPayments.length,
        totalPages: Math.ceil(userPayments.length / pageSize),
      },
    };
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const payment = MOCK_PAYMENTS.find((p) => p.id === paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    return payment;
  }

  async refundPayment(paymentId: string, _reason: string): Promise<Payment> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payment = MOCK_PAYMENTS.find((p) => p.id === paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    payment.status = 'refunded';
    payment.updatedAt = new Date();

    return payment;
  }
}

export const subscriptionService = new SubscriptionService();
