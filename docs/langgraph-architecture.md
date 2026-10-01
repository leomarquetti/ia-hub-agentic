# LangGraph Architecture Specification

## 1. Overview
The multi-agent workflow in **Agentic Ops** is formally structured using the **LangGraph StateGraph** paradigm. In this model, agents are represented as graph nodes, and execution transitions occur across deterministic or conditional edges governed by shared graph state.

---

## 2. Graph State Schema
The central execution state adheres to the following interface:

```typescript
export interface AgentGraphState {
  runId: string;
  objective: string;
  plan: string[];
  activeAgent: string;
  researchData?: NormalizedDataset;
  analysis?: AnalysisOutput;
  report?: ExecutiveReport;
  messages: Array<{ sender: string; receiver: string; content: string }>;
  artifacts: string[];
  errors: string[];
  status: 'IDLE' | 'PLANNING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
}
```

---

## 3. Node Definitions & Responsibilities

### Node 1: Supervisor (`supervisor`)
- **Role:** Central Orchestrator & Task Planner.
- **Inputs:** `objective`, `status`.
- **Transitions:** Evaluates the user objective, decomposes into tasks, appends directives to `messages`, and delegates execution to `research`.

### Node 2: Research (`research`)
- **Role:** Market Research Specialist.
- **Inputs:** `messages` containing extraction directive.
- **Tool Calls:** Browser Research, Page Parser, Pricing Extractor, Data Normalizer.
- **Outputs:** Emits validated `NormalizedDataset` into state, creates `competitive_dataset.json` artifact, and transmits handoff message to `analysis`.

### Node 3: Analysis (`analysis`)
- **Role:** Business Intelligence Analyst.
- **Inputs:** `researchData`.
- **Tool Calls:** Price Variance Engine, Pattern Detector, Opportunity Ranker.
- **Outputs:** Emits `AnalysisOutput` (findings, price_changes, market_patterns, opportunities) validated with Zod, publishes `pricing_analysis.json`.

### Node 4: Report (`report`)
- **Role:** Executive Intelligence Reporter.
- **Inputs:** `analysis`, `researchData`.
- **Tool Calls:** Markdown Synthesizer, Evidence & Source Compiler.
- **Outputs:** Generates `ExecutiveReport` and compiles `executive_report.md` artifact.

---

## 4. Edge Routing & Self-Healing Watchdog
The graph defines both sequential flows and conditional failover routes:

```
[START]
   |
   v
[supervisor]
   |
   v
[research] --(tool failure detected)--> [supervisor: watchdog failover]
   |                                               |
   |                                          (reroute to fallback)
   |                                               |
   |<----------------------------------------------+
   |
   v
[analysis]
   |
   v
[report]
   |
   v
 [END]
```

---

## 5. Public Demo vs Private Runtime Mode
- **Public Portfolio Demo:** Executes through the deterministic in-memory `SimulationEngine`, mirroring every LangGraph state transition and event timing without requiring external LLM API tokens.
- **Private Self-Hosted Runtime:** When configured with `APP_MODE=private` and `OPENAI_API_KEY`, the compiled LangGraph state machine invokes live OpenAI models and tool calling pipelines.
