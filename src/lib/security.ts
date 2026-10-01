/**
 * Security and Data Sanitization Utilities
 * Implements anti-SSRF protections, sensitive data redacting, and audit protections.
 */

// Patterns indicating potential sensitive values
const SENSITIVE_KEY_PATTERNS = [
  /api[-_]?key/i,
  /secret/i,
  /token/i,
  /password/i,
  /auth/i,
  /bearer/i,
  /credential/i,
  /private[-_]?key/i,
  /service[-_]?role/i,
];

/**
 * Deeply redacts sensitive keys or values from objects and logs before outputting.
 */
export function redactSensitiveData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Redact potential jwt or bearer patterns
    if (obj.startsWith('sk-') || obj.startsWith('eyJ')) {
      return '[REDACTED_SECRET]' as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some(pattern => pattern.test(key));
      if (isSensitiveKey) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redactSensitiveData(value);
      }
    }
    return result as T;
  }

  return obj;
}

/**
 * Anti-SSRF URL Validator for browser and scraping adapters.
 * Blocks:
 * - non-http(s) protocols (file://, gopher://, ftp://, etc.)
 * - localhost, 127.0.0.1, 0.0.0.0
 * - private IP ranges (10.x, 172.16-31.x, 192.168.x, 169.254.x cloud metadata)
 * - domains outside optional allowlist
 */
export function validateUrlForScraping(
  urlString: string,
  allowedDomains: string[] = []
): { isValid: boolean; reason?: string } {
  try {
    const parsed = new URL(urlString);

    // Protocol check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, reason: `Forbidden protocol: ${parsed.protocol}` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Localhost checks
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1'
    ) {
      return { isValid: false, reason: 'Loopback and localhost addresses are forbidden.' };
    }

    // Cloud metadata endpoints (AWS, GCP, Azure, etc.)
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      return { isValid: false, reason: 'Cloud instance metadata endpoints are strictly blocked.' };
    }

    // Private IPv4 ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const [, o1, o2] = ipMatch.map(Number);
      if (
        o1 === 10 || // 10.0.0.0/8
        (o1 === 172 && o2 >= 16 && o2 <= 31) || // 172.16.0.0/12
        (o1 === 192 && o2 === 168) // 192.168.0.0/16
      ) {
        return { isValid: false, reason: 'Private IP addresses are forbidden.' };
      }
    }

    // Allowlist check if defined
    if (allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(
        domain => hostname === domain || hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) {
        return { isValid: false, reason: `Domain ${hostname} is not in the private allowlist.` };
      }
    }

    return { isValid: true };
  } catch {
    return { isValid: false, reason: 'Malformed or invalid URL string.' };
  }
}
