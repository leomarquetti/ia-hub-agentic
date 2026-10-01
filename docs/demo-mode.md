# Demo Mode Specification — Agentic Ops

## 1. Zero Setup Guarantee
The hosted public version of **Agentic Ops** is designed to provide an instant, frictionless evaluation experience for recruiters, engineering leaders, and enterprise clients:
- **Zero Local Installs:** Runs entirely in modern web browsers without requiring Node, Python, Docker, or CLI tools.
- **Zero API Keys Required:** Visitors do not provide OpenAI, Anthropic, or cloud provider tokens.
- **Zero Authentication:** Immediate access to all controls without account creation or sign-in walls.
- **Zero Database Setup:** Runs out of the box using client-side state and in-memory deterministic simulation.

---

## 2. Deterministic Simulation Engine
The simulation engine (`src/simulation/engine/simulationEngine.ts`) reproduces authentic multi-agent behavior deterministically:
- Emits real-time event sequences (`run.created`, `tool.completed`, etc.).
- Simulates realistic asynchronous execution delays (with 0.5x, 1x, and 2.5x speed multipliers).
- Supports runtime controls: **Pause**, **Resume**, **Replay**, and **Reset**.
- Offers a **Failure Self-Healing Scenario**: demonstrates watchdog error interception, retries, and failover cache routing.

---

## 3. Synthetic Data Governance
To ensure 100% compliance with data privacy, intellectual property, and public disclosure guidelines:
- **All entities are fictional:** *Velora Systems*, *Kinetiq Works*, *Northwind Digital*.
- **No live web crawling occurs:** All catalog items, prices, and sources are drawn from internal fixtures.
- **Watermark:** All exported artifacts include a certified `SYNTHETIC DEMO DATA` badge.
