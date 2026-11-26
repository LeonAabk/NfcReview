/**
 * Sikkerhetsverktøy for NFC Review UB: ordrenumre som ikke kan gjettes og rensing av input.
 * Admin-innlogging skjer med Google via Firebase (se utils/firebase.ts), ikke med PIN.
 */

// Uten 0/O og 1/I, slik at numrene er lette å lese og skrive av.
const ORDER_ID_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 tegn = 5 bit per tegn
const ORDER_ID_LENGTH = 12; // 60 bit tilfeldighet

/**
 * Lager et tilfeldig ordrenummer, f.eks. NFC-7K3M-Q9XA-2HPD.
 * Nummeret fungerer som nøkkel til sporingssiden, så det må ikke kunne gjettes.
 */
export function generateOrderId(): string {
  const bytes = new Uint8Array(ORDER_ID_LENGTH);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ORDER_ID_ALPHABET[b % ORDER_ID_ALPHABET.length]).join('');
  return `NFC-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export const ORDER_ID_PATTERN = /^NFC-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/;

/**
 * Sanitizes generic user input text, stripping dangerous HTML tags and script injections
 */
export function sanitizeText(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[<>]/g, '') // Strip < and >
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control chars
    .trim();
}

/**
 * Validates and sanitizes URLs to strictly prevent XSS (blocks javascript:, data:, vbscript:)
 */
export function sanitizeSafeUrl(rawUrl?: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (trimmed === '') return null;

  // Explicit check for dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return null;
  }

  try {
    const parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates email format strictly
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}

/**
 * Validates and normalizes phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+\s-]/g, '').trim();
}
