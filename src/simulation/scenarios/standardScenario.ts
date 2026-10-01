import { AgentEvent } from '@/types/events';
import { AgentMessage } from '@/types/messages';
import { Artifact } from '@/types/artifacts';
import {
  SYNTHETIC_PRODUCTS,
  SYNTHETIC_SOURCES,
  SYNTHETIC_PRICE_CHANGES,
  SYNTHETIC_MARKET_PATTERNS,
  SYNTHETIC_STRATEGIC_OPPORTUNITIES,
  SYNTHETIC_ANALYSIS_FINDINGS,
} from '../fixtures/syntheticData';

export interface ScenarioDefinition {
  runId: string;
  name: string;
  objective: string;
  events: AgentEvent[];
  messages: AgentMessage[];
  artifacts: Artifact[];
  delaysMs: number[]; // Relative delays between steps
}

const RUN_ID = 'run-standard-demo-01';

// Artifact contents
const competitiveDatasetJson = JSON.stringify(
  {
    runId: RUN_ID,
    timestamp: '2026-10-01T08:15:00Z',
    status: 'NORMALIZED_ZOD_VALIDATED',
    totalOffers: SYNTHETIC_PRODUCTS.length,
    competitors: ['Velora Systems', 'Kinetiq Works', 'Northwind Digital'],
    sources: SYNTHETIC_SOURCES,
    products: SYNTHETIC_PRODUCTS,
  },
  null,
  2
);

const pricingAnalysisJson = JSON.stringify(
  {
    runId: RUN_ID,
    analyzedAt: '2026-10-01T08:15:20Z',
    findings: SYNTHETIC_ANALYSIS_FINDINGS,
    price_changes: SYNTHETIC_PRICE_CHANGES,
    market_patterns: SYNTHETIC_MARKET_PATTERNS,
    opportunities: SYNTHETIC_STRATEGIC_OPPORTUNITIES,
  },
  null,
  2
);

const sourceSnapshotJson = JSON.stringify(
  {
    runId: RUN_ID,
    environment: 'PORTFOLIO_SIMULATION',
    sources: SYNTHETIC_SOURCES,
    disclaimer: 'All sources are synthetic fixture endpoints for portfolio demonstration.',
  },
  null,
  2
);

const executiveReportMd = `# EXECUTIVE INTELLIGENCE REPORT: COMPETITIVE PRICING & MARKET MOVEMENTS
**Workflow:** Competitive Intelligence Suite  
**Generated At:** 2026-10-01 08:15:30 UTC  
**Environment:** PORTFOLIO DEMO (SYNTHETIC FIXTURE DATA)  
**Security Certification:** Safe for Public Review — No Real Entity Data

---

## 1. Executive Summary
During this simulated multi-agent operational run, **Agentic Ops** conducted an autonomous competitive intelligence assessment across three synthetic competitors (**Velora Systems**, **Kinetiq Works**, and **Northwind Digital**).

The system extracted **53 synthetic product tiers**, normalized multi-currency catalogs, and identified **7 critical price revisions**. The primary market trend is a **mid-tier subscription compression** (-18.4% average reduction) paired with **infrastructure margin capture** through sharp price hikes on telemetry and cross-cloud replication (+28% to +44%).

---

## 2. Competitive Landscape Overview
| Competitor | Role / Category | Extracted SKUs | Key Focus Area |
| :--- | :--- | :--- | :--- |
| **Velora Systems** | Tier-1 Direct Competitor | 21 products | Enterprise Workflow Automation |
| **Kinetiq Works** | Tier-2 Challenger | 18 products | Compute Optimization & Micro-Clusters |
| **Northwind Digital**| Tier-3 Niche Specialist | 14 products | Streaming ETL & Replication Gateways |

---

## 3. Detected Pricing Movements (7 Key Changes)
1. **Velora Core Cloud:** Reduced from $59 to **$49/mo** (-16.9%) — *Top-of-funnel customer acquisition play.*
2. **Velora Enterprise Suite:** Reduced from $289 to **$249/mo** (-13.8%) — *Defensive retention strategy.*
3. **Velora Ingestion Gateway:** Slashed from $150 to **$120/mo** (-20.0%) — *Encourages streaming data lock-in.*
4. **Kinetiq Pro Engine:** Aggressive cut from $119 to **$89/mo** (-25.2%) — *Undercuts Velora Team tier.*
5. **Kinetiq Observability Addon:** Price increased from $45 to **$65/mo** (+44.4%) — *Margin transfer to telemetry.*
6. **Northwind Pipeline Master:** Discounted from $159 to **$129/mo** (-18.9%) — *Mid-market promotional campaign.*
7. **Northwind Realtime Mirror:** Surge hike from $140 to **$180/mo** (+28.6%) — *Bandwidth & egress monetization.*

---

## 4. Strategic Market Patterns
- **Pattern Alpha (Pricing Aggression):** Mid-tier subscription price war between Velora and Kinetiq.
- **Pattern Beta (Margin Shift):** Lowering entry-level developer barrier while increasing recurring add-on costs.
- **Pattern Gamma (Egress Moats):** Cross-cloud synchronization services seeing steep inflation.

---

## 5. Strategic Recommendations & Opportunities
- **Immediate (7 Days):** Announce an **Unmetered Flat-Rate Observability** tier at **$75/mo** to capture disenfranchised Kinetiq customers.
- **Short-Term (30 Days):** Launch **Unified Engine Positioning**, highlighting zero fragmented add-on surcharges.
- **Strategic (Q2):** Introduce a **Zero-Egress Replication Guarantee** to win accounts migrating away from Northwind Digital.

---

## 6. Execution Trace & Methodology
- **Orchestration:** LangGraph state machine with deterministic event dispatching.
- **Extraction:** Synthetic Browser & DOM Parsing tools adhering to strict schemas.
- **Validation:** Structured data validated via Zod schemas.
- **Telemetry:** Zero external network calls made; 100% deterministic reproducibility.
`;

export const STANDARD_SCENARIO: ScenarioDefinition = {
  runId: RUN_ID,
  name: 'Competitive Intelligence Market Scan',
  objective: 'Analyze fictional competitors, collect market information, normalize pricing data, identify patterns and generate an executive intelligence report.',
  
  artifacts: [
    {
      id: 'art-01',
      name: 'Competitive Dataset',
      filename: 'competitive_dataset.json',
      artifactType: 'dataset',
      creatorAgent: 'research',
      createdAt: '2026-10-01T08:15:10Z',
      sizeBytes: 18450,
      itemCountSummary: '53 synthetic products normalized',
      content: competitiveDatasetJson,
      mimeType: 'application/json',
      metadata: { sourcesCount: 3, recordsCount: 53 },
    },
    {
      id: 'art-02',
      name: 'Source Snapshot',
      filename: 'source_snapshot.json',
      artifactType: 'sources',
      creatorAgent: 'research',
      createdAt: '2026-10-01T08:15:12Z',
      sizeBytes: 4210,
      itemCountSummary: '3 competitor mirror domains',
      content: sourceSnapshotJson,
      mimeType: 'application/json',
      metadata: { domains: ['velora-systems.synthetic', 'kinetiq-works.internal', 'northwind-digital.local'] },
    },
    {
      id: 'art-03',
      name: 'Pricing Variance & Pattern Analysis',
      filename: 'pricing_analysis.json',
      artifactType: 'analysis',
      creatorAgent: 'analysis',
      createdAt: '2026-10-01T08:15:22Z',
      sizeBytes: 8960,
      itemCountSummary: '7 price shifts, 4 patterns, 3 opportunities',
      content: pricingAnalysisJson,
      mimeType: 'application/json',
      metadata: { priceChangesCount: 7, opportunitiesCount: 3 },
    },
    {
      id: 'art-04',
      name: 'Executive Intelligence Brief',
      filename: 'executive_report.md',
      artifactType: 'report',
      creatorAgent: 'report',
      createdAt: '2026-10-01T08:15:32Z',
      sizeBytes: 6120,
      itemCountSummary: 'Full executive report with synthetic verification',
      content: executiveReportMd,
      mimeType: 'text/markdown',
      metadata: { format: 'markdown', targetAudience: 'Executive Leadership' },
    },
  ],

  messages: [
    {
      id: 'msg-01',
      runId: RUN_ID,
      sender: 'supervisor',
      receiver: 'research',
      timestamp: '2026-10-01T08:14:02Z',
      type: 'TASK_DELEGATION',
      summary: 'Collect pricing information from approved synthetic competitor domains.',
      payload: {
        directive: 'EXTRACT_COMPETITIVE_CATALOG',
        approvedDomains: ['velora-systems.synthetic', 'kinetiq-works.internal', 'northwind-digital.local'],
        schemaTarget: 'NormalizedDatasetSchema',
      },
    },
    {
      id: 'msg-02',
      runId: RUN_ID,
      sender: 'research',
      receiver: 'analysis',
      timestamp: '2026-10-01T08:14:12Z',
      type: 'DATASET_HANDOFF',
      summary: 'Dataset ready: 53 synthetic offers normalized and validated with Zod.',
      payload: {
        totalRecords: 53,
        competitorsCount: 3,
        artifactRef: 'competitive_dataset.json',
        status: 'VALIDATION_PASSED',
      },
    },
    {
      id: 'msg-03',
      runId: RUN_ID,
      sender: 'analysis',
      receiver: 'report',
      timestamp: '2026-10-01T08:14:22Z',
      type: 'FINDINGS_HANDOFF',
      summary: 'Analysis complete: 7 pricing shifts, 4 market patterns, 3 strategic opportunities.',
      payload: {
        findingsCount: 4,
        priceChangesDetected: 7,
        strategicOpportunitiesCount: 3,
        artifactRef: 'pricing_analysis.json',
      },
    },
    {
      id: 'msg-04',
      runId: RUN_ID,
      sender: 'supervisor',
      receiver: 'report',
      timestamp: '2026-10-01T08:14:24Z',
      type: 'TASK_DELEGATION',
      summary: 'Generate C-level executive intelligence report incorporating evidence and methodology.',
      payload: {
        directive: 'COMPILE_EXECUTIVE_BRIEF',
        includeEvidence: true,
        includeMethodology: true,
      },
    },
    {
      id: 'msg-05',
      runId: RUN_ID,
      sender: 'report',
      receiver: 'supervisor',
      timestamp: '2026-10-01T08:14:32Z',
      type: 'EXECUTION_CONCLUDED',
      summary: 'Executive report artifact created and certified with synthetic data watermark.',
      payload: {
        artifactRef: 'executive_report.md',
        status: 'READY_FOR_PRESENTATION',
        complianceStamp: 'SYNTHETIC_DATA_CONFIRMED',
      },
    },
  ],

  events: [
    {
      id: 'evt-01',
      runId: RUN_ID,
      timestamp: '08:14:00',
      agentId: 'supervisor',
      eventType: 'run.created',
      status: 'PLANNING',
      message: 'Run initialized: Competitive Intelligence workflow started in Portfolio Demo Mode.',
      durationMs: 45,
    },
    {
      id: 'evt-02',
      runId: RUN_ID,
      timestamp: '08:14:01',
      agentId: 'supervisor',
      eventType: 'supervisor.started',
      status: 'PLANNING',
      message: 'Supervisor evaluating objective and compiling LangGraph execution plan.',
      durationMs: 420,
    },
    {
      id: 'evt-03',
      runId: RUN_ID,
      timestamp: '08:14:02',
      agentId: 'supervisor',
      eventType: 'plan.created',
      status: 'RUNNING',
      message: 'Plan established: 4 subagent nodes queued [Research → Analysis → Report → Supervisor].',
      durationMs: 310,
    },
    {
      id: 'evt-04',
      runId: RUN_ID,
      timestamp: '08:14:03',
      agentId: 'supervisor',
      eventType: 'message.sent',
      status: 'RUNNING',
      message: 'Supervisor delegated data extraction task to Research Agent.',
      durationMs: 180,
    },
    {
      id: 'evt-05',
      runId: RUN_ID,
      timestamp: '08:14:04',
      agentId: 'research',
      eventType: 'research.started',
      status: 'RUNNING',
      message: 'Research Agent activated: Initiating synthetic domain scan.',
      durationMs: 250,
    },
    {
      id: 'evt-06',
      runId: RUN_ID,
      timestamp: '08:14:05',
      agentId: 'research',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-browser-research',
      message: 'Tool Browser Research started: Inspecting 3 competitor endpoints.',
      durationMs: 120,
    },
    {
      id: 'evt-07',
      runId: RUN_ID,
      timestamp: '08:14:07',
      agentId: 'research',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-browser-research',
      message: 'Tool Browser Research completed: 53 synthetic raw offer documents acquired.',
      durationMs: 1840,
    },
    {
      id: 'evt-08',
      runId: RUN_ID,
      timestamp: '08:14:08',
      agentId: 'research',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-page-parser',
      message: 'Tool Page Parser started: Decomposing catalog tables and billing frequency.',
      durationMs: 110,
    },
    {
      id: 'evt-09',
      runId: RUN_ID,
      timestamp: '08:14:09',
      agentId: 'research',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-page-parser',
      message: 'Tool Page Parser completed: Extracted 53 distinct pricing tiers.',
      durationMs: 920,
    },
    {
      id: 'evt-10',
      runId: RUN_ID,
      timestamp: '08:14:10',
      agentId: 'research',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-pricing-extractor',
      message: 'Tool Pricing Extractor started: Isolating currency tags and discount structures.',
      durationMs: 95,
    },
    {
      id: 'evt-11',
      runId: RUN_ID,
      timestamp: '08:14:11',
      agentId: 'research',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-pricing-extractor',
      message: 'Tool Pricing Extractor completed: Normalized currency to USD baseline.',
      durationMs: 840,
    },
    {
      id: 'evt-12',
      runId: RUN_ID,
      timestamp: '08:14:12',
      agentId: 'research',
      eventType: 'dataset.created',
      status: 'RUNNING',
      message: 'Dataset assembled: Validated against NormalizedDatasetSchema with Zod.',
      durationMs: 340,
    },
    {
      id: 'evt-13',
      runId: RUN_ID,
      timestamp: '08:14:12',
      agentId: 'research',
      eventType: 'artifact.created',
      status: 'RUNNING',
      message: 'Artifact competitive_dataset.json and source_snapshot.json published.',
      durationMs: 190,
    },
    {
      id: 'evt-14',
      runId: RUN_ID,
      timestamp: '08:14:13',
      agentId: 'research',
      eventType: 'message.sent',
      status: 'SUCCESS',
      message: 'Research Agent transmitted normalized dataset to Analysis Agent.',
      durationMs: 210,
    },
    {
      id: 'evt-15',
      runId: RUN_ID,
      timestamp: '08:14:14',
      agentId: 'analysis',
      eventType: 'analysis.started',
      status: 'RUNNING',
      message: 'Analysis Agent activated: Computing price variances and competitive shifts.',
      durationMs: 310,
    },
    {
      id: 'evt-16',
      runId: RUN_ID,
      timestamp: '08:14:15',
      agentId: 'analysis',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-price-variance-engine',
      message: 'Tool Price Variance Engine started: Evaluating 53 products against historical prices.',
      durationMs: 140,
    },
    {
      id: 'evt-17',
      runId: RUN_ID,
      timestamp: '08:14:17',
      agentId: 'analysis',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-price-variance-engine',
      message: 'Tool Price Variance Engine completed: 7 critical price movements flagged.',
      durationMs: 1720,
    },
    {
      id: 'evt-18',
      runId: RUN_ID,
      timestamp: '08:14:18',
      agentId: 'analysis',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-pattern-detector',
      message: 'Tool Pattern Detector started: Clustering competitor moves into strategic shifts.',
      durationMs: 110,
    },
    {
      id: 'evt-19',
      runId: RUN_ID,
      timestamp: '08:14:20',
      agentId: 'analysis',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-pattern-detector',
      message: 'Tool Pattern Detector completed: Identified 4 high-confidence market trends.',
      durationMs: 1460,
    },
    {
      id: 'evt-20',
      runId: RUN_ID,
      timestamp: '08:14:21',
      agentId: 'analysis',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-opportunity-ranker',
      message: 'Tool Opportunity Ranker started: Scored 3 strategic counter-actions.',
      durationMs: 85,
    },
    {
      id: 'evt-21',
      runId: RUN_ID,
      timestamp: '08:14:22',
      agentId: 'analysis',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-opportunity-ranker',
      message: 'Tool Opportunity Ranker completed: 1 Immediate, 1 Short-Term, 1 Strategic opportunity.',
      durationMs: 910,
    },
    {
      id: 'evt-22',
      runId: RUN_ID,
      timestamp: '08:14:23',
      agentId: 'analysis',
      eventType: 'artifact.created',
      status: 'SUCCESS',
      message: 'Artifact pricing_analysis.json structured output published.',
      durationMs: 240,
    },
    {
      id: 'evt-23',
      runId: RUN_ID,
      timestamp: '08:14:24',
      agentId: 'analysis',
      eventType: 'message.sent',
      status: 'SUCCESS',
      message: 'Analysis Agent transferred structured findings to Report Agent.',
      durationMs: 170,
    },
    {
      id: 'evt-24',
      runId: RUN_ID,
      timestamp: '08:14:25',
      agentId: 'supervisor',
      eventType: 'message.sent',
      status: 'RUNNING',
      message: 'Supervisor ordered Report Agent to draft executive summary and compile evidence.',
      durationMs: 190,
    },
    {
      id: 'evt-25',
      runId: RUN_ID,
      timestamp: '08:14:26',
      agentId: 'report',
      eventType: 'report.started',
      status: 'RUNNING',
      message: 'Report Agent activated: Structuring C-level Intelligence Brief.',
      durationMs: 280,
    },
    {
      id: 'evt-26',
      runId: RUN_ID,
      timestamp: '08:14:27',
      agentId: 'report',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-markdown-synthesizer',
      message: 'Tool Markdown Synthesizer started: Drafting Executive Summary and Pricing Tables.',
      durationMs: 120,
    },
    {
      id: 'evt-27',
      runId: RUN_ID,
      timestamp: '08:14:29',
      agentId: 'report',
      eventType: 'tool.completed',
      status: 'RUNNING',
      toolId: 'tool-markdown-synthesizer',
      message: 'Tool Markdown Synthesizer completed: Formatted markdown document ready.',
      durationMs: 2150,
    },
    {
      id: 'evt-28',
      runId: RUN_ID,
      timestamp: '08:14:30',
      agentId: 'report',
      eventType: 'tool.started',
      status: 'RUNNING',
      toolId: 'tool-evidence-compiler',
      message: 'Tool Evidence Compiler started: Linking claims to synthetic snapshot hashes.',
      durationMs: 110,
    },
    {
      id: 'evt-29',
      runId: RUN_ID,
      timestamp: '08:14:31',
      agentId: 'report',
      eventType: 'tool.completed',
      status: 'SUCCESS',
      toolId: 'tool-evidence-compiler',
      message: 'Tool Evidence Compiler completed: Verified 3 sources with SHA-256 signatures.',
      durationMs: 980,
    },
    {
      id: 'evt-30',
      runId: RUN_ID,
      timestamp: '08:14:32',
      agentId: 'report',
      eventType: 'artifact.created',
      status: 'SUCCESS',
      message: 'Artifact executive_report.md created.',
      durationMs: 220,
    },
    {
      id: 'evt-31',
      runId: RUN_ID,
      timestamp: '08:14:33',
      agentId: 'report',
      eventType: 'message.sent',
      status: 'SUCCESS',
      message: 'Report Agent notified Supervisor of report completion.',
      durationMs: 190,
    },
    {
      id: 'evt-32',
      runId: RUN_ID,
      timestamp: '08:14:34',
      agentId: 'supervisor',
      eventType: 'run.completed',
      status: 'SUCCESS',
      message: 'Workflow execution converged successfully. All 4 agents executed deterministically.',
      durationMs: 460,
    },
  ],

  // Realistic relative delays in milliseconds at 1x speed
  delaysMs: [
    800,   // evt 01: run.created
    1000,  // evt 02: supervisor.started
    900,   // evt 03: plan.created
    800,   // evt 04: msg sent
    900,   // evt 05: research.started
    600,   // evt 06: tool started
    1600,  // evt 07: tool completed (browser)
    600,   // evt 08: tool started
    1000,  // evt 09: tool completed (parser)
    600,   // evt 10: tool started
    900,   // evt 11: tool completed (pricing)
    700,   // evt 12: dataset created
    600,   // evt 13: artifact created
    800,   // evt 14: msg sent
    900,   // evt 15: analysis started
    600,   // evt 16: tool started
    1500,  // evt 17: tool completed (price variance)
    600,   // evt 18: tool started
    1400,  // evt 19: tool completed (patterns)
    600,   // evt 20: tool started
    1000,  // evt 21: tool completed (opportunities)
    600,   // evt 22: artifact created
    800,   // evt 23: msg sent
    800,   // evt 24: msg sent
    900,   // evt 25: report started
    600,   // evt 26: tool started
    1800,  // evt 27: tool completed (markdown)
    600,   // evt 28: tool started
    1000,  // evt 29: tool completed (evidence)
    700,   // evt 30: artifact created
    800,   // evt 31: msg sent
    1000,  // evt 32: run completed
  ],
};
