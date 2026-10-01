# Security & Isolation Architecture — Agentic Ops

## 1. Principles of Defense
Agentic Ops enforces enterprise security principles across all layers:
1. **Zero Secret Leakage:** No credentials exist in public source code or client browser bundles.
2. **Server-Side Demarcation:** External integrations and private credentials are confined to server-side runtimes.
3. **Anti-SSRF Protection:** Web scraping engines are protected against Server-Side Request Forgery.
4. **Data Sanitization:** Telemetry logs and error messages are sanitized and redacted before display.

---

## 2. Server vs Client Boundary
Next.js separates browser client components from server runtimes. Agentic Ops enforces this via `lib/env.ts`:
- **`publicConfig`:** Exposed to client bundles; contains only non-sensitive flags (`appMode`, `appName`, `isSyntheticData`).
- **`getPrivateConfig()`:** Strictly throws an exception if invoked from browser context (`typeof window !== 'undefined'`). Only callable within server actions and API routes.

---

## 3. Anti-SSRF Defense Specification
When deploying web automation or browser adapters in private mode, the system guards against SSRF attacks:

```typescript
// Blocked targets in validateUrlForScraping():
- Protocols other than 'http:' and 'https:' (e.g. file://, gopher://, ftp://)
- Loopback addresses ('localhost', '127.0.0.1', '0.0.0.0', '::1')
- Private IPv4 Subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- Cloud Instance Metadata Endpoints ('169.254.169.254', 'metadata.google.internal')
- Domains not explicitly registered in SCRAPE_ALLOWED_DOMAINS
```

---

## 4. Telemetry Sanitization & Log Redaction
The `redactSensitiveData()` utility recursively scans output objects and redacts values matching sensitive patterns (`apiKey`, `secret`, `token`, `password`, `auth`, `bearer`, `serviceRole`).
