'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import { store } from '@store/index';
import { Header, Footer } from '@components/layout';

const theme = createTheme({
  palette: {
    primary: { main: '#00d4ff' },
    secondary: { main: '#1a1a2e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Online Music and Media Streaming Platform" />
        <title>Online Music Platform - Stream Music Anywhere</title>
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box sx={{ flex: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
