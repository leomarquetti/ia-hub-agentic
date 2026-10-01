import React from 'react';
import {
  ShieldCheck,
  Search,
  BarChart3,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Globe,
  Radio,
} from 'lucide-react';
import { AgentId } from '@/types/agents';
import { AGENT_DEFINITIONS } from '@/agents/agentDefinitions';

interface AgentDetailSidebarProps {
  selectedAgentId: AgentId;
  runtimeState?: {
    status: any;
    currentTask: string;
    runtimeMs: number;
    toolCallsCount: number;
    inputSummary?: string;
    outputSummary?: string;
  };
  toolsState?: Record<string, 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED'>;
}

const AGENT_ICONS = {
  supervisor: ShieldCheck,
  research: Search,
  analysis: BarChart3,
  report: FileText,
};

export const AgentDetailSidebar: React.FC<AgentDetailSidebarProps> = ({
  selectedAgentId,
  runtimeState,
  toolsState = {},
}) => {
  const def = AGENT_DEFINITIONS[selectedAgentId] || AGENT_DEFINITIONS.supervisor;
  const Icon = AGENT_ICONS[selectedAgentId] || ShieldCheck;
  const currentStatus = runtimeState?.status || 'IDLE';

  return (
    <div className="w-full h-full flex flex-col bg-card/90 backdrop-blur-md rounded-2xl border border-card-border overflow-hidden p-5 space-y-4">
      {/* Top Agent Header */}
      <div className="flex items-start justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-accent-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Active Inspector
            </div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">{def.name}</h2>
            <p className="text-xs text-text-muted">{def.role}</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border border-white/10 bg-background-deep/60">
          <span className="flex items-center gap-1.5">
            {currentStatus === 'RUNNING' || currentStatus === 'PLANNING' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                <span className="text-accent-secondary">{currentStatus}</span>
              </>
            ) : currentStatus === 'SUCCESS' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                <span className="text-status-success">SUCCESS</span>
              </>
            ) : currentStatus === 'FAILED' ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-status-danger" />
                <span className="text-status-danger">FAILED</span>
              </>
            ) : (
              <span className="text-text-muted">IDLE</span>
            )}
          </span>
        </div>
      </div>

      {/* Current Task */}
      <div className="space-y-1.5 p-3 rounded-xl bg-background-deep/70 border border-white/5">
        <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-accent-secondary" />
          Current Task
        </div>
        <div className="text-xs text-text-primary font-mono leading-relaxed">
          {runtimeState?.currentTask || 'Waiting for supervisor orchestration dispatch...'}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-background-surface/50 border border-card-border">
          <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-accent-primary" />
            Runtime
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {((runtimeState?.runtimeMs || 0) / 1000).toFixed(1)}s
          </div>
        </div>

        <div className="p-3 rounded-xl bg-background-surface/50 border border-card-border">
          <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1 mb-1">
            <Wrench className="w-3 h-3 text-accent-secondary" />
            Tool Calls
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {runtimeState?.toolCallsCount || 0} executed
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase font-bold tracking-wider text-text-muted flex items-center justify-between">
          <span>Assigned Tools</span>
          <span className="text-[10px] text-accent-secondary font-mono">{def.tools.length} available</span>
        </div>
        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
          {def.tools.map(tool => {
            const toolActiveState = toolsState[tool.id] || 'IDLE';
            return (
              <div
                key={tool.id}
                className="flex items-center justify-between p-2 rounded-lg bg-background-deep/50 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60" />
                  <span className="font-medium text-text-primary truncate max-w-[170px]">
                    {tool.name}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono border border-white/10 bg-white/5 text-text-muted">
                  {toolActiveState === 'RUNNING' ? (
                    <span className="text-accent-secondary animate-pulse">RUNNING</span>
                  ) : toolActiveState === 'SUCCESS' ? (
                    <span className="text-status-success">SUCCESS</span>
                  ) : toolActiveState === 'FAILED' ? (
                    <span className="text-status-danger">FAILED</span>
                  ) : (
                    tool.environment === 'SIMULATED' ? 'SIMULATED' : 'PRIVATE'
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Framework & Runtime Stack */}
      <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
        <div className="text-[11px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-accent-primary" />
          Technical Framework & Adapters
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-background-surface/40 border border-card-border">
            <span className="text-text-muted text-[11px]">Orchestration</span>
            <span className="font-semibold text-text-primary text-[11px]">LangGraph / StateGraph</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-background-surface/40 border border-card-border">
            <span className="text-text-muted text-[11px]">Tool Ecosystem</span>
            <span className="font-semibold text-text-primary text-[11px]">LangChain Core + Zod</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-background-surface/40 border border-card-border">
            <span className="text-text-muted text-[11px]">Browser Adapter</span>
            <span className="font-semibold text-text-primary text-[11px]">
              {selectedAgentId === 'research' ? 'Playwright (Private / Sandboxed)' : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-background-surface/40 border border-card-border">
            <span className="text-text-muted text-[11px]">Execution Environment</span>
            <span className="font-semibold text-accent-secondary text-[11px]">Simulated Demo Mode</span>
          </div>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="space-y-1 pt-1 text-xs">
        <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-1">
          Core Responsibilities
        </div>
        <ul className="space-y-1 text-[11px] text-text-muted list-disc list-inside">
          {def.responsibilities.slice(0, 3).map((resp, i) => (
            <li key={i} className="truncate">{resp}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
