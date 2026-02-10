'use client';

import { useEffect, useState } from 'react';
import { useMedia } from '@hooks/useMedia';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PlayButton } from '@components/media';

export default function MediaDetailPage() {
  const params = useParams();
  const mediaId = params?.id as string;
  const media = useMedia();
  const [mediaItem, setMediaItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (mediaId) {
      loadMedia();
    }
  }, [mediaId]);

  const loadMedia = async () => {
    setIsLoading(true);
    const result = await media.getMediaById(mediaId);
    if (result.success) {
      setMediaItem(result.data);
    }
    setIsLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!mediaItem) return;

    const userId = 'user-001'; // In real app, get from auth
    if (isFavorite) {
      await media.removeFromFavorites(userId, mediaId);
    } else {
      await media.addToFavorites(userId, mediaId);
    }
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!mediaItem) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Media not found</div>;
  }

  const getQualityOptions = () => {
    if (!mediaItem.quality || mediaItem.quality.length === 0) {
      return 'Information not available';
    }
    return mediaItem.quality.map((q: any) => q.resolution).join(', ');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/media" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
            ← Back to Browse
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', alignItems: 'start' }}>
          <div>
            <img
              src={mediaItem.posterUrl || mediaItem.thumbnailUrl}
              alt={mediaItem.title}
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
            <button
              onClick={handleToggleFavorite}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: isFavorite ? '#0070f3' : '#e0e0e0',
                color: isFavorite ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {isFavorite ? '❤️ Loved' : '🤍 Add to Favorites'}
            </button>
            {/* Play button: allow playback if user is authenticated (bypass subscription in mock) */}
            <PlayButton mediaItem={mediaItem} />
          </div>

          <div>
            <h1 style={{ marginBottom: '10px' }}>{mediaItem.title}</h1>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '14px' }}>
                <strong>Type:</strong> {mediaItem.type.charAt(0).toUpperCase() + mediaItem.type.slice(1)}
              </span>
              <span style={{ fontSize: '14px' }}>
                <strong>Rating:</strong> ⭐ {mediaItem.rating}/5
              </span>
              <span style={{ fontSize: '14px' }}>
                <strong>Views:</strong> {mediaItem.totalViews.toLocaleString()}
              </span>
            </div>

            <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666' }}>
              {mediaItem.description}
            </p>

            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ marginBottom: '15px' }}>Details</h3>

              {mediaItem.artist && (
                <p style={{ margin: '10px 0' }}>
                  <strong>Artist:</strong> {mediaItem.artist}
                </p>
              )}

              {mediaItem.director && (
                <p style={{ margin: '10px 0' }}>
                  <strong>Director:</strong> {mediaItem.director}
                </p>
              )}

              <p style={{ margin: '10px 0' }}>
                <strong>Genre:</strong> {mediaItem.genre.join(', ')}
              </p>

              <p style={{ margin: '10px 0' }}>
                <strong>Duration:</strong>{' '}
                {Math.floor(mediaItem.duration / 60)}
                {mediaItem.duration % 60 > 0 ? `m ${mediaItem.duration % 60}s` : 'm'}
              </p>

              <p style={{ margin: '10px 0' }}>
                <strong>Release Date:</strong> {new Date(mediaItem.releaseDate).toLocaleDateString()}
              </p>

              <p style={{ margin: '10px 0' }}>
                <strong>Quality Options:</strong> {getQualityOptions()}
              </p>

              {mediaItem.isExplicit && (
                <p style={{ margin: '10px 0', color: '#d00' }}>
                  <strong>⚠️ Explicit Content</strong>
                </p>
              )}
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '15px' }}>Ready to watch?</h3>
              <p style={{ marginBottom: '15px' }}>Subscribe to your preferred plan to start streaming.</p>
              <Link
                href="/subscriptions"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
