import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import type { RegisterRequest } from '../../types/dto';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'acceptTerms' ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (!formData.acceptTerms) {
      setLocalError('Please accept the terms and conditions');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    } as RegisterRequest);

    if (!result.success) {
      setLocalError(result.error || 'Registration failed');
    } else {
      onSuccess?.();
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {(localError || error) && <Alert severity="error">{localError || error}</Alert>}

      <TextField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={isLoading}
        fullWidth
        placeholder="Enter your full name"
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        fullWidth
        placeholder="Enter your email"
      />

      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        disabled={isLoading}
        fullWidth
        placeholder="Enter your phone number"
      />

      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        fullWidth
        placeholder="Create a password"
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

      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isLoading}
        fullWidth
        placeholder="Confirm your password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            disabled={isLoading}
          />
        }
        label={
          <Typography variant="body2">
            I agree to the{' '}
            <MuiLink href="#" sx={{ color: '#00d4ff' }}>
              Terms and Conditions
            </MuiLink>
          </Typography>
        }
      />

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
        {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <MuiLink component={Link} href="/auth/login" sx={{ cursor: 'pointer', color: '#00d4ff' }} underline="none">
          Already have an account? Login
        </MuiLink>
      </Box>
    </Box>
  );
}
