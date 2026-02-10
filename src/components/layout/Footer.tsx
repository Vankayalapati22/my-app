import { Box, Container, Typography, Grid, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#1a1a2e',
        color: '#fff',
        py: 6,
        mt: 10,
        borderTop: '1px solid #00d4ff',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2 }}>
              🎵 Winfo Music Hub
            </Typography>
            <Typography variant="body2" color="gray">
              Your ultimate music streaming platform for all genres and moods.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/media" sx={{ color: '#fff', cursor: 'pointer', '&:hover': { color: '#00d4ff' } }} underline="none">
                Browse Music
              </MuiLink>
              <MuiLink component={Link} href="/subscriptions" sx={{ color: '#fff', cursor: 'pointer', '&:hover': { color: '#00d4ff' } }} underline="none">
                Plans
              </MuiLink>
              <MuiLink component={Link} href="/upload" sx={{ color: '#fff', cursor: 'pointer', '&:hover': { color: '#00d4ff' } }} underline="none">
                Upload Content
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" sx={{ color: '#fff', '&:hover': { color: '#00d4ff' } }}>
                Privacy Policy
              </MuiLink>
              <MuiLink href="#" sx={{ color: '#fff', '&:hover': { color: '#00d4ff' } }}>
                Terms of Service
              </MuiLink>
              <MuiLink href="#" sx={{ color: '#fff', '&:hover': { color: '#00d4ff' } }}>
                Cookie Policy
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2 }}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" sx={{ color: '#fff', '&:hover': { color: '#00d4ff' } }}>
                Twitter
              </MuiLink>
              <MuiLink href="#" sx={{ color: '#fff', '&:hover': { color: '#00d4ff' } }}>
                Facebook
              </MuiLink>
              <MuiLink href="#" sx={{ color: '#fff', '&:hover': { color: '#00d4ff' } }}>
                Instagram
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid #333', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="gray">
              © 2026 Winfo Music Hub. All rights reserved.
            </Typography>
        </Box>
      </Container>
    </Box>
  );
}
