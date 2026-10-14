/**
 * Stremio API Service (100% Client-Side)
 * 
 * All requests are dispatched directly from the user's browser to Stremio's official endpoints
 * (https://api.strem.io/api/*).
 * 
 * Privacy Guarantee:
 * - No intermediate servers, proxies, or analytics databases are involved.
 * - Credentials and auth keys remain strictly in client memory (or opt-in local storage).
 */

import {
  StremioAddonCollectionGetResponse,
  StremioAddonCollectionSetResponse,
  StremioAddonDescriptor,
  StremioAuthResponse,
} from '../types/stremio';

const STREMIO_API_BASE = 'https://api.strem.io/api';
const LOCAL_STORAGE_KEY = 'stremio_manager_auth_key';

/**
 * Standard HTTP POST request helper for Stremio's RPC-style API.
 */
async function callStremioApi<T>(endpoint: string, payload: Record<string, unknown>): Promise<T> {
  const url = `${STREMIO_API_BASE}/${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Network failure connecting to Stremio API: ${errorMsg}. Please check your internet connection or ad-blocker settings.`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Invalid JSON response from Stremio API (HTTP ${response.status}).`);
  }

  // Handle Stremio API error envelopes
  if (data?.error) {
    const message = data.error.message || 'Unknown error occurred from Stremio API';
    if (message.includes('Session does not exist')) {
      throw new Error('Invalid or expired Stremio Auth Key. Please check your key and try again.');
    }
    if (message.includes('Wrong passphrase') || data.error.wrongPass) {
      throw new Error('Incorrect Stremio email or password. Please verify your credentials.');
    }
    throw new Error(`Stremio API Error: ${message}`);
  }

  return data as T;
}

/**
 * Authenticate with Stremio via Email and Password.
 * Returns the session authKey and basic user info.
 */
export async function loginWithCredentials(
  email: string,
  pass: string
): Promise<{ authKey: string; email?: string }> {
  const payload = {
    type: 'Login',
    email: email.trim(),
    password: pass,
  };

  const data = await callStremioApi<StremioAuthResponse>('login', payload);

  if (!data?.result?.authKey) {
    throw new Error('Authentication succeeded, but no auth key was returned by Stremio.');
  }

  return {
    authKey: data.result.authKey,
    email: data.result.user?.email || email,
  };
}

/**
 * Fetch the user's currently installed add-ons from Stremio cloud.
 * Endpoint: POST /api/addonCollectionGet
 */
export async function fetchAddonCollection(authKey: string): Promise<StremioAddonDescriptor[]> {
  const cleanKey = authKey.trim();
  if (!cleanKey) {
    throw new Error('Auth key cannot be empty.');
  }

  const payload = {
    type: 'AddonCollectionGet',
    authKey: cleanKey,
  };

  const data = await callStremioApi<StremioAddonCollectionGetResponse>('addonCollectionGet', payload);

  if (!data?.result || !Array.isArray(data.result.addons)) {
    throw new Error('Unexpected response format: Addon collection missing from Stremio response.');
  }

  return data.result.addons;
}

/**
 * Persist the newly ordered addon array back to Stremio's cloud profile.
 * Stremio clients (Desktop, Web, Android TV, Mobile) will immediately reflect this order upon sync.
 * Endpoint: POST /api/addonCollectionSet
 */
export async function saveAddonCollection(
  authKey: string,
  addons: StremioAddonDescriptor[]
): Promise<boolean> {
  const cleanKey = authKey.trim();
  if (!cleanKey) {
    throw new Error('Auth key cannot be empty.');
  }

  const payload = {
    type: 'AddonCollectionSet',
    authKey: cleanKey,
    addons: addons,
  };

  const data = await callStremioApi<StremioAddonCollectionSetResponse>('addonCollectionSet', payload);

  // Stremio returns { result: { success: true } } or { result: true }
  if (data?.result?.success === true || data?.result === true as unknown) {
    return true;
  }

  // If no explicit error was thrown and result exists, treat as success
  return Boolean(data?.result);
}

/**
 * Browser LocalStorage helpers for user convenience (opt-in).
 */
export function getStoredAuthKey(): string | null {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveStoredAuthKey(authKey: string): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, authKey);
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

export function clearStoredAuthKey(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
