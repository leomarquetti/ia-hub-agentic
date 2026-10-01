'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Play,
  RotateCcw,
  RefreshCw,
  AlertOctagon,
  Network,
  ShieldCheck,
  FileCheck2,
  Clock,
  Wrench,
  Activity,
  Layers,
  Sparkles,
  ArrowDown,
  Info,
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { WorkflowGraph } from '@/components/workflow/WorkflowGraph';
import { AgentDetailSidebar } from '@/components/agents/AgentDetailSidebar';
import { LiveEventStream } from '@/components/events/LiveEventStream';
import { CommunicationStream } from '@/components/communication/CommunicationStream';
import { ArtifactsPanel } from '@/components/artifacts/ArtifactsPanel';
import { ExecutiveReportModal } from '@/components/reports/ExecutiveReportModal';
import { PayloadModal } from '@/components/ui/PayloadModal';
import { FutureAgentsSection } from '@/components/future/FutureAgentsSection';
import { HumanInTheLoopBanner } from '@/components/ui/HumanInTheLoopBanner';

import { SimulationEngine } from '@/simulation/engine/simulationEngine';
import { AgentId } from '@/types/agents';
import { AgentEvent, MetricSummary } from '@/types/events';
import { AgentMessage } from '@/types/messages';
import { Artifact } from '@/types/artifacts';
import { PlaybackSpeed, PlaybackState, ViewMode, WorkflowRunState } from '@/types/workflows';

export default function Home() {
  // Simulation State
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [metrics, setMetrics] = useState<MetricSummary>({
    runDurationMs: 0,
    agentsExecuted: 0,
    toolCallsCount: 0,
    eventsCount: 0,
    artifactsCount: 0,
    messagesCount: 0,
    status: 'IDLE',
  });

  const [workflowState, setWorkflowState] = useState<WorkflowRunState>({
    runId: 'run-standard-demo-01',
    objective:
      'Analyze fictional competitors, collect market information, normalize pricing data, identify patterns and generate an executive intelligence report.',
    playbackState: 'IDLE',
    speed: 1,
    viewMode: 'DEFAULT',
    activeAgentId: null,
    selectedAgentId: 'supervisor',
    activeEdgeId: null,
    failureSimulationActive: false,
    plan: [],
    totalDurationMs: 0,
  });

  // Per-Agent Runtime State Tracking
  const [agentRuntimeStates, setAgentRuntimeStates] = useState<
    Record<
      AgentId,
      {
        status: any;
        currentTask: string;
        runtimeMs: number;
        toolCallsCount: number;
      }
    >
  >({
    supervisor: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
    research: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
    analysis: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
    report: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
  });

  const [toolsActiveState, setToolsActiveState] = useState<
    Record<string, 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED'>
  >({});

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [payloadModal, setPayloadModal] = useState<{
    isOpen: boolean;
    title: string;
    payload: unknown;
  }>({
    isOpen: false,
    title: '',
    payload: null,
  });

  // Reference to Simulation Engine
  const engineRef = useRef<SimulationEngine | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Initialize Engine
  useEffect(() => {
    const engine = new SimulationEngine({
      onEvent: event => {
        setEvents(prev => [...prev, event]);

        // Update Agent State
        setAgentRuntimeStates(prev => {
          const current = prev[event.agentId] || {
            status: 'IDLE',
            currentTask: '',
            runtimeMs: 0,
            toolCallsCount: 0,
          };
          return {
            ...prev,
            [event.agentId]: {
              ...current,
              status: event.status,
              currentTask: event.message,
              runtimeMs: current.runtimeMs + (event.durationMs || 200),
              toolCallsCount:
                event.eventType === 'tool.completed'
                  ? current.toolCallsCount + 1
                  : current.toolCallsCount,
            },
          };
        });

        // Update Tool State if event has toolId
        if (event.toolId) {
          if (event.eventType === 'tool.started') {
            setToolsActiveState(prev => ({ ...prev, [event.toolId!]: 'RUNNING' }));
          } else if (event.eventType === 'tool.completed') {
            setToolsActiveState(prev => ({ ...prev, [event.toolId!]: 'SUCCESS' }));
          } else if (event.eventType === 'tool.failed') {
            setToolsActiveState(prev => ({ ...prev, [event.toolId!]: 'FAILED' }));
          }
        }
      },
      onMessage: msg => {
        setMessages(prev => [...prev, msg]);
      },
      onArtifact: art => {
        setArtifacts(prev => [...prev, art]);
      },
      onStateUpdate: updatedState => {
        setWorkflowState(updatedState);
      },
      onMetricsUpdate: updatedMetrics => {
        setMetrics(updatedMetrics);
      },
      onComplete: () => {
        // Automatically display executive report upon run completion
        setTimeout(() => {
          setIsReportOpen(true);
        }, 1200);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.reset();
    };
  }, []);

  // Execution Handlers
  const handleRunDemo = () => {
    setEvents([]);
    setMessages([]);
    setArtifacts([]);
    setToolsActiveState({});
    setAgentRuntimeStates({
      supervisor: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
      research: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
      analysis: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
      report: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
    });
    engineRef.current?.start();
  };

  const handlePause = () => engineRef.current?.pause();
  const handleResume = () => engineRef.current?.resume();
  const handleReplay = () => {
    setEvents([]);
    setMessages([]);
    setArtifacts([]);
    setToolsActiveState({});
    engineRef.current?.replay();
  };
  const handleReset = () => {
    setEvents([]);
    setMessages([]);
    setArtifacts([]);
    setToolsActiveState({});
    setAgentRuntimeStates({
      supervisor: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
      research: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
      analysis: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
      report: { status: 'IDLE', currentTask: '', runtimeMs: 0, toolCallsCount: 0 },
    });
    engineRef.current?.reset();
  };

  const handleToggleFailure = () => {
    const nextFailure = !workflowState.failureSimulationActive;
    engineRef.current?.loadScenario(nextFailure);
  };

  const handleSetSpeed = (s: PlaybackSpeed) => engineRef.current?.setSpeed(s);

  const handleToggleTechMode = () => {
    setWorkflowState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'TECH' ? 'DEFAULT' : 'TECH',
    }));
  };

  const handleTogglePresentationMode = () => {
    setWorkflowState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'PRESENTATION' ? 'DEFAULT' : 'PRESENTATION',
    }));
  };

  const handleSelectAgent = (agentId: AgentId) => {
    setWorkflowState(prev => ({ ...prev, selectedAgentId: agentId }));
  };

  const handleViewPayload = (title: string, payload: unknown) => {
    setPayloadModal({ isOpen: true, title, payload });
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isPresentation = workflowState.viewMode === 'PRESENTATION';
  const isTechMode = workflowState.viewMode === 'TECH';

  return (
    <div className="min-h-screen bg-background-deep text-text-primary flex flex-col font-sans selection:bg-accent-primary selection:text-white relative">
      {/* Dynamic Ambient Control Plane Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,92,255,0.15),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#16243830_1px,transparent_1px),linear-gradient(to_bottom,#16243830_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Main Navbar */}
      <div className="relative z-30">
        <Navbar
          playbackState={workflowState.playbackState}
          speed={workflowState.speed}
          viewMode={workflowState.viewMode}
          isFailureActive={workflowState.failureSimulationActive}
          onRunDemo={handleRunDemo}
          onPause={handlePause}
          onResume={handleResume}
          onReplay={handleReplay}
          onReset={handleReset}
          onToggleFailure={handleToggleFailure}
          onSetSpeed={handleSetSpeed}
          onToggleTechMode={handleToggleTechMode}
          onTogglePresentationMode={handleTogglePresentationMode}
        />
      </div>

      {/* Top Hero Section (Landing view) */}
      {!isPresentation && (
        <section className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-8 pb-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO DEMONSTRATION • DETERMINISTIC SIMULATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            AGENTIC OPS{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-secondary to-status-success">
              CONTROL CENTER
            </span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted max-w-3xl mx-auto leading-relaxed">
            Multi-Agent AI systems for research, analysis and business automation. An interactive portfolio demonstration of multi-agent orchestration, autonomous task delegation, tool execution and AI observability.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              'MULTI-AGENT',
              'LANGGRAPH',
              'LANGCHAIN',
              'LLM',
              'TOOL CALLING',
              'ZOD SCHEMAS',
              'SUPABASE',
              'POSTGRESQL',
              'PLAYWRIGHT',
              'RAG READY',
            ].map(b => (
              <span
                key={b}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 border border-white/10 text-text-muted"
              >
                {b}
              </span>
            ))}
          </div>

          {/* Action CTA Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRunDemo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(124,92,255,0.4)] transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN LIVE DEMO</span>
            </button>

            <Link
              href="/architecture"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-card-hover border border-card-border text-text-primary text-xs font-semibold transition-colors"
            >
              <Network className="w-4 h-4 text-accent-secondary" />
              <span>VIEW ARCHITECTURE</span>
            </Link>
          </div>
        </section>
      )}

      {/* Main Workspace Area */}
      <main
        ref={workspaceRef}
        className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4"
      >
        {/* Observability Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border">
            <div className="text-[10px] uppercase font-bold text-text-muted">Run Duration</div>
            <div className="text-sm font-mono font-bold text-text-primary">
              {(metrics.runDurationMs / 1000).toFixed(1)}s
            </div>
            <div className="text-[9px] text-text-subtle font-mono">
              Speed: {workflowState.speed}x
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border">
            <div className="text-[10px] uppercase font-bold text-text-muted">Agents Executed</div>
            <div className="text-sm font-mono font-bold text-accent-primary">
              {metrics.agentsExecuted} of 4
            </div>
            <div className="text-[9px] text-text-subtle font-mono">Supervisor Model</div>
          </div>

          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border">
            <div className="text-[10px] uppercase font-bold text-text-muted">Tool Calls</div>
            <div className="text-sm font-mono font-bold text-accent-secondary">
              {metrics.toolCallsCount} executed
            </div>
            <div className="text-[9px] text-text-subtle font-mono">Synthetic Adapters</div>
          </div>

          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border">
            <div className="text-[10px] uppercase font-bold text-text-muted">Events Emitted</div>
            <div className="text-sm font-mono font-bold text-status-success">
              {metrics.eventsCount} events
            </div>
            <div className="text-[9px] text-text-subtle font-mono">Audit Log Trace</div>
          </div>

          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border">
            <div className="text-[10px] uppercase font-bold text-text-muted">Artifacts</div>
            <div className="text-sm font-mono font-bold text-[#F5B942]">
              {metrics.artifactsCount} published
            </div>
            <div className="text-[9px] text-text-subtle font-mono">Verified Zod</div>
          </div>

          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border">
            <div className="text-[10px] uppercase font-bold text-text-muted">Inter-Agent Msgs</div>
            <div className="text-sm font-mono font-bold text-text-primary">
              {metrics.messagesCount} sent
            </div>
            <div className="text-[9px] text-text-subtle font-mono">Data Flow Stream</div>
          </div>

          <div className="p-3 rounded-xl bg-card/85 backdrop-blur-md border border-card-border col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-text-muted">Workflow Status</div>
            <div className="text-sm font-mono font-bold flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  metrics.status === 'RUNNING'
                    ? 'bg-accent-secondary animate-pulse'
                    : metrics.status === 'SUCCESS'
                    ? 'bg-status-success'
                    : metrics.status === 'PAUSED'
                    ? 'bg-status-warning'
                    : 'bg-text-subtle'
                }`}
              />
              <span
                className={
                  metrics.status === 'SUCCESS'
                    ? 'text-status-success'
                    : metrics.status === 'RUNNING'
                    ? 'text-accent-secondary'
                    : 'text-text-primary'
                }
              >
                {metrics.status}
              </span>
            </div>
            <div className="text-[9px] text-text-subtle font-mono truncate">
              {workflowState.failureSimulationActive ? 'Failover Active' : 'Primary Path'}
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Architecture Ready Banner */}
        <HumanInTheLoopBanner />

        {/* Workflow Graph and Detail Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Workflow Graph (Takes 8 cols in default, full 12 in presentation) */}
          <div
            className={`${
              isPresentation ? 'lg:col-span-12 h-[560px]' : 'lg:col-span-8 h-[520px]'
            } transition-all`}
          >
            <WorkflowGraph
              workflowState={workflowState}
              onSelectAgent={handleSelectAgent}
              agentRuntimeStates={agentRuntimeStates}
            />
          </div>

          {/* Right Inspector Sidebar (Takes 4 cols in default mode, hidden in presentation) */}
          {!isPresentation && (
            <div className="lg:col-span-4 h-[520px]">
              <AgentDetailSidebar
                selectedAgentId={workflowState.selectedAgentId || 'supervisor'}
                runtimeState={
                  agentRuntimeStates[workflowState.selectedAgentId || 'supervisor']
                }
                toolsState={toolsActiveState}
              />
            </div>
          )}
        </div>

        {/* Inter-Agent Communication & Artifacts Split Grid */}
        {!isPresentation && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6">
              <CommunicationStream
                messages={messages}
                onViewPayload={handleViewPayload}
              />
            </div>
            <div className="lg:col-span-6">
              <ArtifactsPanel
                artifacts={artifacts}
                onViewArtifact={art => {
                  if (art.artifactType === 'report') {
                    setIsReportOpen(true);
                  } else {
                    handleViewPayload(art.name, art.content);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Live Execution Event Stream (Bottom Area) */}
        {!isPresentation && (
          <LiveEventStream
            events={events}
            isTechMode={isTechMode}
            onViewPayload={handleViewPayload}
          />
        )}

        {/* Horizontal Expansion Future Agents Section */}
        {!isPresentation && <FutureAgentsSection />}

        {/* Bottom Portfolio Disclaimer Footer */}
        <footer className="pt-6 pb-8 border-t border-white/5 text-center text-xs text-text-muted space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-primary" />
            <span className="font-semibold text-text-primary">
              AGENTIC OPS • PUBLIC PORTFOLIO DEMONSTRATION
            </span>
          </div>
          <p className="text-[11px] text-text-subtle max-w-xl mx-auto">
            All companies (Velora Systems, Kinetiq Works, Northwind Digital), products, pricing, and datasets shown in this demo are fictional. Deterministic in-memory simulation engine for public evaluation.
          </p>
        </footer>
      </main>

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* JSON / Structured Output Payload Inspector Modal */}
      <PayloadModal
        isOpen={payloadModal.isOpen}
        title={payloadModal.title}
        payload={payloadModal.payload}
        onClose={() => setPayloadModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
