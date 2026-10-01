'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Cpu,
  Layers,
  Database,
  Shield,
  FileCheck,
  Globe,
  Radio,
  Workflow,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ArchitectureNode {
  id: string;
  title: string;
  category: string;
  status: 'ACTIVE IN DEMO' | 'SIMULATED' | 'PRIVATE RUNTIME' | 'ARCHITECTURE READY' | 'OPTIONAL';
  description: string;
  technicalDetails: string;
  technologies: string[];
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'user',
    title: 'Client Interface & Browser',
    category: 'User Layer',
    status: 'ACTIVE IN DEMO',
    description: 'Zero-installation interactive client interface delivering high-fidelity AI observability.',
    technicalDetails: 'Built with Next.js 14 App Router, React 18, React Flow, and Tailwind CSS. Runs deterministically in any modern browser without accounts, tokens, or local dependencies.',
    technologies: ['Next.js', 'React', 'React Flow', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'nextjs',
    title: 'Application Control Plane',
    category: 'Application Layer',
    status: 'ACTIVE IN DEMO',
    description: 'Unified full-stack execution runtime coordinating deterministic simulation and server-side logic.',
    technicalDetails: 'Server Actions and API routes isolate private secrets from client bundles. Strict environment separation guarantees zero sensitive configuration reaches the browser.',
    technologies: ['Next.js API Routes', 'TypeScript Strict Mode', 'Security Headers'],
  },
  {
    id: 'supervisor',
    title: 'Supervisor Node (Orchestrator)',
    category: 'Multi-Agent Layer',
    status: 'ACTIVE IN DEMO',
    description: 'Central task planner decomposing user objectives into specialized subagent workflows.',
    technicalDetails: 'Implements LangGraph supervisor pattern. Emits structured state updates, monitors subagent health, detects tool timeouts, and routes execution to failover mirrors.',
    technologies: ['LangGraph', 'Task Decomposition', 'Watchdog Policy'],
  },
  {
    id: 'langgraph',
    title: 'LangGraph Orchestration Framework',
    category: 'Orchestration Engine',
    status: 'ACTIVE IN DEMO',
    description: 'Graph-based state machine governing agent execution transitions, cyclic retries, and conditional branching.',
    technicalDetails: 'In Public Demo, execution flows through deterministic state machines mirroring LangGraph nodes. In Private Runtime, compiled StateGraph runs live LLM tool chains.',
    technologies: ['@langchain/langgraph', 'StateGraph', 'Conditional Routing'],
  },
  {
    id: 'subagents',
    title: 'Specialized Subagents (Research, Analysis, Report)',
    category: 'Agent Execution Layer',
    status: 'ACTIVE IN DEMO',
    description: 'Isolated domain specialists possessing bounded responsibilities and dedicated tool sets.',
    technicalDetails: 'Research Agent gathers and extracts; Analysis Agent calculates price variance and market patterns; Report Agent synthesizes executive intelligence briefs with evidence links.',
    technologies: ['Multi-Agent Architecture', 'Role Isolation', 'Inter-Agent Messaging'],
  },
  {
    id: 'tools',
    title: 'Tool Calling Adapters',
    category: 'Tooling Layer',
    status: 'SIMULATED',
    description: 'Decoupled tool interfaces enabling agents to interact with external environments safely.',
    technicalDetails: 'Public Demo uses deterministic Synthetic Tools (Browser Research, Page Parser, Pricing Extractor, Normalizer). Private environments connect to sandboxed Playwright engines.',
    technologies: ['Synthetic Tools', 'Structured Extraction', 'Zod Schemas'],
  },
  {
    id: 'playwright',
    title: 'Playwright Browser Automation',
    category: 'Automation Engine',
    status: 'PRIVATE RUNTIME',
    description: 'Headless browser automation adapter used in private/live enterprise deployments. Disabled in Public Demo.',
    technicalDetails: 'Protected by anti-SSRF guards: blocks file://, loopback, private RFC1918 IPs, and cloud metadata endpoints (169.254.169.254). Strict domain allowlisting enforced.',
    technologies: ['Playwright Chromium', 'Anti-SSRF Validation', 'Domain Sandboxing'],
  },
  {
    id: 'zod',
    title: 'Zod Structured Output Enforcement',
    category: 'Data Governance',
    status: 'ACTIVE IN DEMO',
    description: 'Runtime type inference and schema validation ensuring clean handoffs between agents.',
    technicalDetails: 'Every inter-agent message, dataset, and analysis output must conform to strict Zod schemas before being passed downstream.',
    technologies: ['Zod 3.x', 'TypeScript Schema Validation', 'Type Inference'],
  },
  {
    id: 'event-stream',
    title: 'Event-Driven Observability Stream',
    category: 'Telemetry Layer',
    status: 'ACTIVE IN DEMO',
    description: 'Granular execution audit log with timestamps, agent badges, tool timings, and payload inspection.',
    technicalDetails: 'All execution actions are modeled as discrete events (run.created, tool.completed, etc.) facilitating complete post-run auditability and replayability.',
    technologies: ['Event-Driven Architecture', 'Telemetry', 'Payload Inspection'],
  },
  {
    id: 'supabase',
    title: 'PostgreSQL & Supabase Realtime',
    category: 'Persistence Layer',
    status: 'OPTIONAL',
    description: 'Enterprise relational persistence for agent runs, events, messages, and published artifacts.',
    technicalDetails: 'Fully documented SQL schema in supabase/schema.sql. Application operates completely in-memory in Public Demo, ensuring zero database setup is required for visitors.',
    technologies: ['PostgreSQL', 'Supabase Realtime', 'Row Level Security'],
  },
  {
    id: 'pgvector',
    title: 'pgvector / Semantic Knowledge Layer',
    category: 'RAG Architecture',
    status: 'ARCHITECTURE READY',
    description: 'Future semantic memory layer for embedding ingestion, document chunking, and context retrieval.',
    technicalDetails: 'Architecture prepared for Knowledge Agent expansion. Supports HNSW vector indexing and hybrid dense-sparse retrieval without requiring live embedding APIs in demo.',
    technologies: ['pgvector', 'Cosine Similarity', 'HNSW Indexing', 'RAG Pipeline'],
  },
  {
    id: 'artifacts',
    title: 'Structured Output Artifacts',
    category: 'Delivery Layer',
    status: 'ACTIVE IN DEMO',
    description: 'Certified analytical deliverables (competitive_dataset.json, pricing_analysis.json, executive_report.md).',
    technicalDetails: 'Published artifacts are verified with synthetic data watermarks, downloadable, copyable, and ready for C-suite executive consumption.',
    technologies: ['Markdown Briefs', 'Structured JSON', 'Synthetic Verification Watermark'],
  },
];

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_NODES[2]); // Default to Supervisor

  const getStatusColor = (status: ArchitectureNode['status']) => {
    switch (status) {
      case 'ACTIVE IN DEMO':
        return 'bg-status-success/15 text-status-success border-status-success/30';
      case 'SIMULATED':
        return 'bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30';
      case 'PRIVATE RUNTIME':
        return 'bg-status-danger/15 text-status-danger border-status-danger/30';
      case 'ARCHITECTURE READY':
        return 'bg-accent-primary/15 text-accent-primary border-accent-primary/30';
      case 'OPTIONAL':
        return 'bg-white/10 text-text-muted border-white/15';
    }
  };

  return (
    <div className="min-h-screen bg-background-deep text-text-primary flex flex-col font-sans selection:bg-accent-primary selection:text-white">
      {/* Top Bar */}
      <header className="w-full bg-card/90 backdrop-blur-md border-b border-card-border px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors py-1 px-2.5 rounded-lg bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Control Center</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Workflow className="w-4 h-4 text-accent-primary" />
            System Architecture & Technical Topology
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted text-[11px]">MODE:</span>
          <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-status-success border border-status-success/30 font-bold text-[10px]">
            TRANSPARENT SYSTEM SPEC
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-8">
        {/* Intro */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text-primary tracking-tight">
            Multi-Agent Architecture & Governance Plane
          </h2>
          <p className="text-sm text-text-muted max-w-3xl leading-relaxed">
            Explore the decoupled architectural layers powering <strong>Agentic Ops</strong>. Select any component below to inspect its technical design, runtime status in this public demonstration, and enterprise production behavior.
          </p>
        </div>

        {/* Two Column Layout: Component Grid & Interactive Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Component Nodes Flow (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-text-muted flex items-center justify-between pb-1">
              <span>Architectural Layers (Click to inspect)</span>
              <span className="font-mono text-[10px] text-accent-secondary">12 system components</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARCHITECTURE_NODES.map(node => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-card border-accent-primary shadow-[0_0_20px_rgba(124,92,255,0.25)] ring-1 ring-accent-primary/50'
                        : 'bg-card/70 hover:bg-card border-card-border hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-text-subtle font-mono">
                          {node.category}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getStatusColor(
                            node.status
                          )}`}
                        >
                          {node.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-text-primary leading-snug">
                        {node.title}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                        {node.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                      {node.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-muted border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Component Deep-Dive (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-card-border shadow-2xl space-y-5">
              {/* Header */}
              <div className="space-y-2 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent-secondary font-mono">
                    {selectedNode.category}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getStatusColor(
                      selectedNode.status
                    )}`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-text-primary tracking-tight">
                  {selectedNode.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Technical Implementation */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold tracking-wider text-text-primary flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-accent-primary" />
                  Technical Specification
                </div>
                <div className="p-3.5 rounded-xl bg-background-deep/80 border border-white/5 text-xs text-text-primary/90 leading-relaxed font-mono">
                  {selectedNode.technicalDetails}
                </div>
              </div>

              {/* Technology Badges */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold tracking-wider text-text-primary flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent-secondary" />
                  Technologies & Standards
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Production vs Demo Mode Contrast */}
              <div className="p-4 rounded-xl bg-background-surface/60 border border-white/5 text-xs space-y-2">
                <div className="font-bold text-[11px] uppercase text-text-primary flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-status-success" />
                  Portfolio Demonstration Guarantee
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  This public build is 100% deterministic, zero-cost, and safe. Private credentials, arbitrary scraping endpoints, and third-party dependencies are strictly excluded from the public code repository.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
