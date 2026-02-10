'use client';

import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push('/');
    };

    performLogout();
  }, [logout, router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Logging out...</p>
    </div>
  );
}
