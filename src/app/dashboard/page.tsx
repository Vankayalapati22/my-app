'use client';

import React, { useEffect } from 'react';
import { useAuth, useAuthRequired } from '@hooks/useAuth';
import { useMedia } from '@hooks/useMedia';
import Link from 'next/link';

export default function DashboardPage() {
  const { isReady } = useAuthRequired();
  const { user } = useAuth();
  const media = useMedia();
  const [trendingMedia, setTrendingMedia] = React.useState<any[]>([]);
  const [recommendedMedia, setRecommendedMedia] = React.useState<any[]>([]);

  useEffect(() => {
    if (isReady && user) {
      loadDashboardData();
    }
  }, [isReady, user]);

  const loadDashboardData = async () => {
    const trendingResult = await media.getTrendingMedia(6);
    if (trendingResult.success) {
      setTrendingMedia(trendingResult.data || []);
    }

    if (user) {
      const recommendedResult = await media.getRecommended(user.id, 6);
      if (recommendedResult.success) {
        setRecommendedMedia(recommendedResult.data || []);
      }
    }
  };

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Online Music Platform</h1>
          <div>
            <Link href="/profile" style={{ marginRight: '20px', color: '#0070f3' }}>
              {user?.name}
            </Link>
            <Link href="/logout" style={{ color: '#0070f3' }}>
              Logout
            </Link>
          </div>
        </div>
      </header>

      <nav style={{ padding: '15px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
          <Link href="/dashboard" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
            Home
          </Link>
          <Link href="/media" style={{ color: '#666', textDecoration: 'none' }}>
            Browse
          </Link>
          <Link href="/playlists" style={{ color: '#666', textDecoration: 'none' }}>
            Playlists
          </Link>
          <Link href="/upload" style={{ color: '#666', textDecoration: 'none' }}>
            Upload
          </Link>
          <Link href="/subscriptions" style={{ color: '#666', textDecoration: 'none' }}>
            Plans
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <section style={{ marginBottom: '60px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
            <h2>Welcome back, {user?.name}!</h2>
            <p>Ready to discover new music? Check out our trending content below.</p>
          </div>
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '20px' }}>Trending Now</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
            {trendingMedia.map((item) => (
              <Link
                key={item.id}
                href={`/media/${item.id}`}
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                <div>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>
                      {item.title}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      by {item.artist || 'Unknown'}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#0070f3' }}>
                      ⭐ {item.rating}/5
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '20px' }}>Recommended For You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
            {recommendedMedia.map((item) => (
              <Link
                key={item.id}
                href={`/media/${item.id}`}
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                <div>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>
                      {item.title}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      by {item.artist || 'Unknown'}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#0070f3' }}>
                      ⭐ {item.rating}/5
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
