
import { PageConfig } from './types';

const BASE_URL = '/api/pages';

export async function fetchUserLayout(pageName: string, userId: string): Promise<PageConfig | null> {
  try {
    const res = await fetch(`${BASE_URL}/merged-layout?name=${encodeURIComponent(pageName)}&userId=${encodeURIComponent(userId)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch layout');
    return await res.json() as PageConfig;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function saveUserLayout(userOverlay: { pageId: string; userId: string; overrides: any }): Promise<void> {
  const res = await fetch(`${BASE_URL}/save-user-layout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userOverlay),
  });
  if (!res.ok) throw new Error('Failed to save user layout');
}

export async function fetchBaseLayout(pageName: string): Promise<PageConfig> {
  const res = await fetch(`${BASE_URL}/base-layout?name=${encodeURIComponent(pageName)}`);
  if (!res.ok) throw new Error('Failed to fetch base layout');
  return await res.json() as PageConfig;
}
