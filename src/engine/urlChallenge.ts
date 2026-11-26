import { CANONICAL_URL } from '../config/seo';
import { SharedChallenge } from '../types';

export function encodeChallengeToUrl(challenge: SharedChallenge): string {
  const json = JSON.stringify(challenge);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const url = new URL(CANONICAL_URL);
  url.searchParams.set('reto', base64);
  return url.toString();
}

export function decodeChallengeFromUrl(): SharedChallenge | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('reto');
    if (!raw) return null;
    const pad = raw.length % 4 === 0 ? '' : '='.repeat(4 - (raw.length % 4));
    const base64 = raw.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as SharedChallenge;
    if (!parsed || !parsed.type) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearChallengeFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('reto');
    window.history.replaceState({}, '', url.toString());
  } catch {
    // ignore
  }
}
