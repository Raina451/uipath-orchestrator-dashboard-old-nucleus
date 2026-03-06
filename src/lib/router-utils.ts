/**
 * Router utility functions for OAuth and navigation
 */
export function getOAuthRedirectUri(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:5173';
  }
  const { protocol, hostname, port } = window.location;
  const portPart = port ? `:${port}` : '';
  return `${protocol}//${hostname}${portPart}`;
}
export function isOAuthCallback(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('code') && params.has('state');
}