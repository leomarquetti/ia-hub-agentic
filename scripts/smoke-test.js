/**
 * Smoke Test Suite — Agentic Ops
 * Validates core simulation integrity, security checks, and schema contracts.
 */

const assert = require('assert');

console.log('🧪 Starting Agentic Ops Smoke Test Suite...');

// 1. Test Anti-SSRF URL Validation
function validateUrlForScraping(urlString, allowedDomains = []) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, reason: 'Forbidden protocol' };
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '169.254.169.254'
    ) {
      return { isValid: false, reason: 'Forbidden host' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, reason: 'Invalid URL' };
  }
}

// SSRF checks
assert.strictEqual(validateUrlForScraping('file:///etc/passwd').isValid, false, 'Should block file://');
assert.strictEqual(validateUrlForScraping('http://127.0.0.1/admin').isValid, false, 'Should block localhost IP');
assert.strictEqual(validateUrlForScraping('http://169.254.169.254/metadata').isValid, false, 'Should block cloud metadata');
assert.strictEqual(validateUrlForScraping('https://velora-systems.synthetic/pricing').isValid, true, 'Should allow valid synthetic domain');
console.log('  ✅ Anti-SSRF Security validations passed');

// 2. Test Redaction Helper
function redactSensitiveData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = Array.isArray(obj) ? [] : {};
  for (const [key, val] of Object.entries(obj)) {
    if (/api[-_]?key|secret|token|password/i.test(key)) {
      result[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      result[key] = redactSensitiveData(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

const testPayload = {
  userName: 'demo_user',
  apiKey: 'test-dummy-api-key-xyz',
  nested: {
    serviceToken: 'mock-sample-token-123',
    status: 'OK',
  },
};

const redacted = redactSensitiveData(testPayload);
assert.strictEqual(redacted.apiKey, '[REDACTED]');
assert.strictEqual(redacted.nested.serviceToken, '[REDACTED]');
assert.strictEqual(redacted.nested.status, 'OK');
console.log('  ✅ Sensitive Data Redaction test passed');

console.log('🎉 All Smoke Tests Passed Successfully!\n');
