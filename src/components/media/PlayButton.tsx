'use client';
import { Button } from '@mui/material';
import { useAuth } from '@hooks/useAuth';

type Props = { mediaItem: any };

export default function PlayButton({ mediaItem }: Props) {
  const { isAuthenticated } = useAuth();

  const handlePlay = async () => {
    if (!mediaItem) return;

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
      return;
    }

    let url: string | undefined = mediaItem?.quality?.[0]?.url;
    if (!url || url.includes('example.com')) {
      url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    }

    if (typeof window === 'undefined') return;

    // eslint-disable-next-line no-console
    console.debug('[PlayButton] attempting playback URL:', url);

    // Best-effort fetch to detect obvious network issues
    try {
      const resp = await fetch(url, { method: 'GET', mode: 'cors' });
      if (!resp.ok) {
        const msg = `Network request failed with status ${resp.status}`;
        // eslint-disable-next-line no-console
        console.error('[PlayButton] fetch failed:', msg);
        alert('Playback failed: ' + msg);
        return;
      }
    } catch (fetchErr: any) {
      // eslint-disable-next-line no-console
      console.warn('[PlayButton] fetch error (may be CORS):', fetchErr);
      // continue — some hosts block fetch but still serve media to <audio>
    }

    try {
      // Create or reuse a hidden audio element on the page
      const win = window as any;
      if (!win.__winfo_audio_player) {
        win.__winfo_audio_player = document.createElement('audio');
        win.__winfo_audio_player.controls = true;
        win.__winfo_audio_player.style.display = 'none';
        document.body.appendChild(win.__winfo_audio_player);
      }

      const player: HTMLAudioElement = win.__winfo_audio_player;
      player.pause();
      player.src = url as string;
      player.preload = 'auto';
      player.crossOrigin = 'anonymous';

      const onError = () => {
        const code = player.error?.code;
        let reason = 'Unknown audio error';
        if (code === 1) reason = 'Aborted';
        if (code === 2) reason = 'Network error';
        if (code === 3) reason = 'Decode error';
        if (code === 4) reason = 'Source not supported';
        // eslint-disable-next-line no-console
        console.error('[PlayButton] audio element error', code, reason, player.error);
        //alert('Playback failed: ' + reason + (player.error?.message ? ' - ' + player.error.message : ''));
        player.removeEventListener('error', onError);
      };

      player.addEventListener('error', onError);
      await player.play();
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Playback failed:', e);
      try {
        alert('Playback failed: ' + (e?.message || String(e)));
      } catch (_) {}
    }
  };

  return (
    <Button onClick={handlePlay} variant="contained" sx={{ width: '100%', padding: '12px', backgroundColor: '#0070f3' }}>
      ▶️ Play Now
    </Button>
  );
}
