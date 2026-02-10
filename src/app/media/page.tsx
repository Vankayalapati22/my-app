'use client';

import { useEffect, useState } from 'react';
import { useMedia } from '@hooks/useMedia';
import Link from 'next/link';

export default function MediaListPage() {
  const media = useMedia();
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    const result = await media.getMediaList({ page: 1, pageSize: 12 });
    if (result.success) {
      setMediaList(result.data || []);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadMedia();
      return;
    }

    setIsLoading(true);
    const result = await media.searchMedia({
      query: searchQuery,
      page: 1,
      pageSize: 12,
    });
    if (result.success) {
      setMediaList(result.data || []);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
            ← Back to Home
          </Link>
          <h1>Browse Media</h1>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
            {mediaList.map((item) => (
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
                  cursor: 'pointer',
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
                      {item.type === 'song' && `by ${item.artist || 'Unknown'}`}
                      {item.type === 'movie' && `by ${item.director || 'Unknown'}`}
                      {(item.type === 'podcast' || item.type === 'audiobook') && item.artist}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                      <span style={{ backgroundColor: '#e0e0e0', padding: '2px 6px', borderRadius: '3px' }}>
                        {item.type}
                      </span>
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#0070f3' }}>
                      ⭐ {item.rating}/5 • {item.totalViews.toLocaleString()} views
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && mediaList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No media found. Try searching for something.</p>
          </div>
        )}
      </main>
    </div>
  );
}
