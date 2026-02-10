// Authentication Utilities
export function generateMockToken(userId: string) {
  // Generate mock JWT tokens (for demo purposes only)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  );
  const signature = btoa('mock-signature');

  return {
    accessToken: `${header}.${payload}.${signature}`,
    refreshToken: `${header}.${btoa(JSON.stringify({ refresh: true }))}.${signature}`,
    expiresIn: 86400,
    tokenType: 'Bearer' as const,
  };
}

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const expiresAt = payload.exp * 1000;

    return Date.now() > expiresAt;
  } catch {
    return true;
  }
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function setTokenToStorage(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
}

export function clearTokenFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}
