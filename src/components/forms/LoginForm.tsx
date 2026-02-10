import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import type { LoginRequest } from '../../types/dto';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login({ email, password } as LoginRequest);
    if (!result.success) {
      setLocalError(result.error || 'Login failed');
    } else {
      onSuccess?.();
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {(localError || error) && <Alert severity="error">{localError || error}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        fullWidth
        placeholder="Enter your email"
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        fullWidth
        placeholder="Enter your password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Typography variant="caption" sx={{ color: '#666' }}>
        Demo credentials: john.doe@example.com / password
      </Typography>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          backgroundColor: '#00d4ff',
          color: '#1a1a2e',
          fontWeight: 'bold',
          py: 1.5,
          '&:hover': { backgroundColor: '#00a8cc' },
        }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>

      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <MuiLink component={Link} href="/auth/register" sx={{ cursor: 'pointer', color: '#00d4ff' }} underline="none">
          {"Don't have an account? Sign up"}
        </MuiLink>
        <MuiLink
          href="#"
          sx={{ cursor: 'pointer', color: '#00d4ff' }}
          onClick={(e) => e.preventDefault()}
        >
          Forgot password?
        </MuiLink>
      </Box>
    </Box>
  );
}
