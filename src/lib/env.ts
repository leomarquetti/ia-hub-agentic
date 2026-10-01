/**
 * Secure Environment Configuration
 * 
 * Strict separation between PUBLIC and PRIVATE configurations.
 * Prevents accidental client-side leakage of secrets.
 * In Public Portfolio Demo mode, no private secrets are required.
 */

export type AppMode = 'portfolio' | 'private';

interface PublicConfig {
  appMode: AppMode;
  appName: string;
  appVersion: string;
  demoModeOnly: boolean;
  isSyntheticData: boolean;
}

interface PrivateConfig {
  openaiApiKey?: string;
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  playwrightEnabled: boolean;
  allowedScrapeDomains: string[];
}

/**
 * Client-safe public configuration
 * Accessible anywhere in client and server
 */
export const publicConfig: PublicConfig = {
  appMode: (process.env.NEXT_PUBLIC_APP_MODE as AppMode) || 'portfolio',
  appName: 'Agentic Ops - AI Operations Control Center',
  appVersion: '1.0.0',
  demoModeOnly: true,
  isSyntheticData: true,
};

/**
 * Server-only private configuration
 * Throws or returns sanitized fallback when accessed in client
 */
export function getPrivateConfig(): PrivateConfig {
  if (typeof window !== 'undefined') {
    throw new Error('Security Violation: getPrivateConfig() called in browser client context');
  }

  return {
    openaiApiKey: process.env.OPENAI_API_KEY ? '[CONFIGURED]' : undefined,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '[CONFIGURED]' : undefined,
    playwrightEnabled: process.env.ENABLE_PRIVATE_PLAYWRIGHT === 'true',
    allowedScrapeDomains: (process.env.SCRAPE_ALLOWED_DOMAINS || 'demo.local,synthetic.internal')
      .split(',')
      .map(d => d.trim()),
  };
}

/**
 * Verifies if private execution runtime is enabled
 */
export function isPrivateRuntimeAvailable(): boolean {
  if (typeof window !== 'undefined') return false;
  return Boolean(process.env.OPENAI_API_KEY && process.env.APP_MODE === 'private');
}
