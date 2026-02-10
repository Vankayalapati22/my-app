'use client';

import Link from 'next/link';
import { Container, Box, Typography, Grid, Button, Paper } from '@mui/material';
import { Card } from '@components/common';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StorageIcon from '@mui/icons-material/Storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Home() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #00d4ff 100%)',
          color: 'white',
          py: 10,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <MusicNoteIcon sx={{ fontSize: '2.5rem' }} />
            Welcome to Winfo Music Hub
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Stream millions of songs, movies, and podcasts with crystal-clear quality
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#a1f3ff',
                color: '#1a1a2e',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#7ae8f5' },
                textDecoration: 'none',
              }}
            >
              Sign Up Free
            </Button>
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: '#a1f3ff', color: '#a1f3ff' },
                textDecoration: 'none',
              }}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#1a1a2e' }}
          >
            What You Can Do
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                title="Browse Media"
                subtitle="Discover new content"
                actions={
                  <Button component={Link} href="/media" size="small" sx={{ color: '#00d4ff', textDecoration: 'none' }}>
                    Explore →
                  </Button>
                }
              >
                <MusicNoteIcon sx={{ fontSize: '3rem', color: '#00d4ff', mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  Discover new content across all genres and get personalized recommendations
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                title="Choose a Plan"
                subtitle="Perfect for everyone"
                actions={
                  <Button component={Link} href="/subscriptions" size="small" sx={{ color: '#00d4ff', textDecoration: 'none' }}>
                    View Plans →
                  </Button>
                }
              >
                <StorageIcon sx={{ fontSize: '3rem', color: '#00d4ff', mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  Select from multiple subscription plans tailored to your needs
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                title="Upload Content"
                subtitle="Share with the world"
                actions={
                  <Button component={Link} href="/upload" size="small" sx={{ color: '#00d4ff', textDecoration: 'none' }}>
                    Get Started →
                  </Button>
                }
              >
                <CloudUploadIcon sx={{ fontSize: '3rem', color: '#00d4ff', mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  Share your music or videos with our community
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Features Highlight */}
        <Paper sx={{ p: 4, backgroundColor: 'white', mb: 8, borderLeft: '4px solid #00d4ff' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1a1a2e' }}>
            Premium Features
          </Typography>
          <Grid container spacing={2}>
            {[
              '✓ High-quality streaming (up to 4K)',
              '✓ Offline downloads for Premium users',
              '✓ Personalized recommendations',
              '✓ Multiple subscription plans',
              '✓ Content upload and moderation',
              '✓ Family sharing',
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Typography sx={{ color: '#666' }}>{feature}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
