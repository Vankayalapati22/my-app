'use client';

import { Container, Box, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@components/forms';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            p: 4,
            backgroundColor: 'white',
            borderTop: '4px solid #00d4ff',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 1,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#1a1a2e',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: '#666',
            }}
          >
            Sign in to your Winfo Music Hub account
          </Typography>

          <LoginForm onSuccess={handleLoginSuccess} />
        </Paper>
      </Box>
    </Container>
  );
}
