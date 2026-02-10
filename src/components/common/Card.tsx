import React from 'react';
import { Card as MuiCard, CardContent, CardActions, Typography } from '@mui/material';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  sx?: any;
}

export function Card({ title, subtitle, children, actions, sx }: CardProps) {
  return (
    <MuiCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <CardContent>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: subtitle ? 1 : 0 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      )}

      <CardContent sx={{ flex: 1 }}>
        {children}
      </CardContent>

      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
}
