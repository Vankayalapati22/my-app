import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    router.push('/');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#5a50c6' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 0 }}>
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#00d4ff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            🎵 Winfo Music Hub
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={Link} href="/dashboard" color="inherit" sx={{ '&:hover': { color: '#00d4ff' } }}>
              Dashboard
            </Button>
            <Button component={Link} href="/media" color="inherit" sx={{ '&:hover': { color: '#00d4ff' } }}>
              Browse
            </Button>
            <Button component={Link} href="/subscriptions" color="inherit" sx={{ '&:hover': { color: '#00d4ff' } }}>
              Plans
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: '#00d4ff',
                    color: '#1a1a2e',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#00a8cc' },
                  }}
                >
                  {user?.name?.split(' ')[0] || 'Account'}
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem disabled>
                    <Typography variant="caption">{user?.email}</Typography>
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem component={Link} href="/upload">Upload</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                  <Button
                    color="inherit"
                    sx={{
                      border: '1px solid #00d4ff',
                      '&:hover': { backgroundColor: '#00d4ff', color: '#1a1a2e' },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{
                      backgroundColor: '#00d4ff',
                      color: '#1a1a2e',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#00a8cc' },
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
