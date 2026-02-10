'use client';

import { Container, Box, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@components/forms';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
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
            Create Account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: '#666',
            }}
          >
            Join Winfo Music Hub and start streaming
          </Typography>

          <RegisterForm onSuccess={handleRegisterSuccess} />
        </Paper>
      </Box>
    </Container>
  );
}
