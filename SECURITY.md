# Security Policy — Agentic Ops

## 1. Project Purpose & Scope
**Agentic Ops** is an interactive public portfolio demonstration illustrating multi-agent AI systems, LangGraph orchestration, tool calling, and AI observability.

- **Zero Real Integrations:** The hosted public demonstration uses deterministic synthetic fixtures and in-memory execution engines.
- **No External Scraping:** No live web scraping is conducted in the public build.
- **Fictional Entities:** All organizations, product names, pricing structures, and sources are strictly fictional.
- **No API Keys in Demo:** The public demonstration operates without requiring LLM provider tokens, database credentials, or external network requests.

---

## 2. Secure Secret Management Architecture
To maintain enterprise-grade security standards even within a portfolio repository:
1. **Zero Secret Storage in Client Code:** No API keys, credentials, or service role secrets are present in client components (`"use client"`) or prefixed with `NEXT_PUBLIC_`.
2. **Server-Side Isolation:** Private adapters (such as live OpenAI callers or sandboxed Playwright engines) exist solely in server-side API routes or background worker architectures.
3. **Sensitive Data Redaction:** All telemetry and logging routines utilize deep object sanitization (`redactSensitiveData()`) to prevent accidental leaks.
4. **Git Hygiene:** Local configuration files (`.env`, `.env.local`, `.env.*.local`) are strictly ignored via `.gitignore`.

---

## 3. Anti-SSRF & Web Automation Protections
The private Playwright adapter architecture incorporates strict server-side safeguards:
- **Protocol Allowlist:** Only `http:` and `https:` schemes are permitted; protocols like `file://`, `gopher://`, and `ftp://` are rejected.
- **Loopback & Private IP Blocking:** Addresses resolving to `127.0.0.1`, `localhost`, `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16` are blocked.
- **Cloud Metadata Defense:** Strict blocking of instance metadata IP addresses (`169.254.169.254`, `metadata.google.internal`).
- **Domain Allowlisting:** Automated scraping requires explicit domain registration within private environment configuration.

---

## 4. Reporting Security Inquiries
If you discover a potential vulnerability or security concern within this demonstration repository, please reach out via GitHub Security Advisories or contact the repository maintainer directly.
