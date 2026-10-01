# System Architecture — Agentic Ops

## 1. Overview
**Agentic Ops** is designed as a decoupled, multi-tiered AI Operations Control Plane. It demonstrates an end-to-end architecture capable of orchestrating autonomous agents, coordinating tool calling, capturing granular event telemetry, and producing structured analytical artifacts.

```
+-------------------------------------------------------------------------+
|                               USER LAYER                                |
|  Next.js 14 Web UI • React Flow Graph • Observability Stream • Modals   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                          EXECUTION & RUNTIME                            |
|    Simulation Engine (Public Demo)  /  LangGraph Engine (Private Live)  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        SUPERVISOR ORCHESTRATOR                          |
|         Task Decomposition • State Aggregation • Watchdog Recovery       |
+-------------------------------------------------------------------------+
             |                                             |
             v                                             v
+-------------------------+                   +-------------------------+
|     RESEARCH AGENT      |                   |     ANALYSIS AGENT      |
|  Market Catalog Scan    |                   |  Variance & Pattern BI  |
|  Browser Tool Adapter   |                   |  Opportunity Ranking    |
+-------------------------+                   +-------------------------+
             |                                             |
             +----------------------+----------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                              REPORT AGENT                               |
|        Executive Brief Synthesizer • Evidence Compilation & Hash        |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           DELIVERABLE LAYER                             |
|  competitive_dataset.json • pricing_analysis.json • executive_report.md  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           PERSISTENCE LAYER                             |
|        PostgreSQL / Supabase Schema • pgvector Semantic Embeddings       |
+-------------------------------------------------------------------------+
```

---

## 2. Decoupled Architectural Layers

### 1. Presentation & Observability Layer
- **Framework:** Next.js 14 App Router, React 18, Tailwind CSS, Lucide icons.
- **Workflow Visualization:** `@xyflow/react` (React Flow) rendering custom nodes (`AgentNode`) and animated directional edges (`AnimatedDataEdge`) with dynamic particle flows.
- **Real-Time Stream:** Unified execution event stream capturing timestamps, durations, and payload inspection.

### 2. Orchestration Layer
- **Pattern:** Supervisor / Subagents pattern modeled after LangGraph StateGraph.
- **State Management:** Strict state annotation capturing objective, active agent, messages, and artifact links.
- **Error Interception:** Autonomous watchdog intercepting tool failures, managing retry counts, and invoking fallback mirrors.

### 3. Tool Execution Layer
- **Interface Contract:** Standardized `AgentTool<TInput, TOutput>` interface ensuring interchangeable adapters.
- **Synthetic Adapters:** In-memory, deterministic tools for safe public portfolio demonstration.
- **Private Adapters:** Sandboxed Playwright headless browser tool equipped with anti-SSRF protections and domain allowlists.

### 4. Data Governance & Structured Outputs
- **Schema Validation:** Runtime type inference using Zod schemas for all inter-agent messages, datasets, and reports.
- **Immutability:** Each run generates distinct, versioned artifact documents.

### 5. Persistence Layer
- **Relational Model:** PostgreSQL / Supabase schema for runs, events, messages, and artifacts.
- **RAG Preparation:** `knowledge_chunks` table with pgvector cosine indexing for semantic memory.
