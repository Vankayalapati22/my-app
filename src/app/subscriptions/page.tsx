'use client';

import { useEffect, useState } from 'react';
import { useSubscription } from '@hooks/useSubscription';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const subscription = useSubscription();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    const result = await subscription.getPlans();
    if (result.success) {
      setPlans(result.data || []);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
            ← Back to Home
          </Link>
          <h1>Subscription Plans</h1>
          <p>Choose the perfect plan for your needs</p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                border: plan.id === 'plan-002' ? '2px solid #0070f3' : '1px solid #eee',
              }}
            >
              {plan.id === 'plan-002' && (
                <div style={{ backgroundColor: '#0070f3', color: 'white', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ padding: '30px', flex: 1 }}>
                <h2 style={{ marginBottom: '10px' }}>{plan.name}</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>{plan.description}</p>

                <div style={{ marginBottom: '30px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                    ${plan.pricePerMonth}
                    <span style={{ fontSize: '14px', color: '#666' }}>/month</span>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ marginBottom: '15px' }}>Features:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '10px', fontSize: '14px' }}>
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Max Concurrent Streams:</strong> {plan.maxConcurrentStreams}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Video Quality:</strong> {plan.videoQuality}
                  </p>
                  {plan.maxDownloads > 0 && (
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      <strong>Max Downloads:</strong> {plan.maxDownloads === -1 ? 'Unlimited' : plan.maxDownloads}
                    </p>
                  )}
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: plan.id === 'plan-001' ? '#e0e0e0' : '#0070f3',
                    color: plan.id === 'plan-001' ? '#333' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: plan.id === 'plan-001' ? 'default' : 'pointer',
                  }}
                  disabled={plan.id === 'plan-001'}
                >
                  {plan.id === 'plan-001' ? 'Current Plan' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <section style={{ marginTop: '60px', backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '20px' }}>Frequently Asked Questions</h2>

          <div style={{ marginBottom: '20px' }}>
            <h4>Can I change my plan?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Can I cancel my subscription?</h4>
            <p>Yes, you can cancel anytime without penalties. You'll have access until the end of your billing period.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>What payment methods do you accept?</h4>
            <p>We accept credit/debit cards, PayPal, Apple Pay, and Google Pay.</p>
          </div>

          <div>
            <h4>Is there a free trial?</h4>
            <p>Our free plan gives you access to browse and enjoy limited features. Upgrade anytime for unlimited streaming.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
