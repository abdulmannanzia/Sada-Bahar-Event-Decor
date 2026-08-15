import { CMSData, PortfolioProject, Review, ContactQuery, Service, PortfolioCategory } from '../types.js';

const ADMIN_TOKEN_KEY = 'sb_decor_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Public Data Fetcher
export async function fetchPublicData() {
  const res = await fetch('/api/public/data');
  if (!res.ok) throw new Error('Failed to load website content');
  return res.json();
}

// Submit Contact Query
export async function submitContactQuery(data: { name: string; phone: string; message: string }) {
  const res = await fetch('/api/public/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit query');
  return json;
}

// Submit Customer Feedback
export async function submitCustomerFeedback(data: {
  customerName: string;
  eventCategory: string;
  rating: number;
  comment: string;
  photos: string[];
}) {
  const res = await fetch('/api/public/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit feedback');
  return json;
}

// Admin Login
export async function adminLogin(credentials: { username: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  if (json.token) setAdminToken(json.token);
  return json;
}

export async function fetchAdminData() {
  const token = getAdminToken();
  if (!token) throw new Error('No admin session');

  const res = await fetch('/api/admin/data', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load admin dashboard data');
  return res.json();
}

// Helper for protected POST requests
export async function postAdminApi(endpoint: string, payload: any) {
  const token = getAdminToken();
  if (!token) throw new Error('No admin session');

  const res = await fetch(`/api/admin/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Action failed');
  return json;
}

// Helper for protected DELETE requests
export async function deleteAdminApi(endpoint: string) {
  const token = getAdminToken();
  if (!token) throw new Error('No admin session');

  const res = await fetch(`/api/admin/${endpoint}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Delete failed');
  return json;
}
