import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  ShieldCheck,
  Search,
  BarChart3,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AgentId, AgentStatus } from '@/types/agents';

export interface AgentNodeData {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  runtimeMs: number;
  toolCallsCount: number;
  isActive: boolean;
  isSelected: boolean;
  badge: string;
  [key: string]: unknown;
}

const AGENT_ICONS = {
  supervisor: ShieldCheck,
  research: Search,
  analysis: BarChart3,
  report: FileText,
};

const AGENT_COLORS = {
  supervisor: {
    border: 'border-[#7C5CFF]',
    glow: 'shadow-[0_0_20px_rgba(124,92,255,0.35)]',
    badgeBg: 'bg-[#7C5CFF]/15 text-[#A58FFF]',
  },
  research: {
    border: 'border-[#19C3FF]',
    glow: 'shadow-[0_0_20px_rgba(25,195,255,0.35)]',
    badgeBg: 'bg-[#19C3FF]/15 text-[#63D8FF]',
  },
  analysis: {
    border: 'border-[#25D695]',
    glow: 'shadow-[0_0_20px_rgba(37,214,149,0.35)]',
    badgeBg: 'bg-[#25D695]/15 text-[#5EF4BC]',
  },
  report: {
    border: 'border-[#F5B942]',
    glow: 'shadow-[0_0_20px_rgba(245,185,66,0.35)]',
    badgeBg: 'bg-[#F5B942]/15 text-[#FED078]',
  },
};

export const AgentNode = memo(({ data }: { data: AgentNodeData }) => {
  const Icon = AGENT_ICONS[data.id] || ShieldCheck;
  const colorScheme = AGENT_COLORS[data.id] || AGENT_COLORS.supervisor;

  const getStatusBadge = () => {
    switch (data.status) {
      case 'RUNNING':
      case 'PLANNING':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-secondary bg-accent-secondary/15 rounded-full border border-accent-secondary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
            {data.status}
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-status-success bg-status-success/15 rounded-full border border-status-success/30">
            <CheckCircle2 className="w-3 h-3" />
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-status-danger bg-status-danger/15 rounded-full border border-status-danger/30">
            <AlertTriangle className="w-3 h-3" />
            FAILED
          </span>
        );
      case 'PAUSED':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-status-warning bg-status-warning/15 rounded-full border border-status-warning/30">
            PAUSED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted bg-white/5 rounded-full border border-white/10">
            IDLE
          </span>
        );
    }
  };

  return (
    <div
      className={`relative min-w-[280px] max-w-[310px] rounded-xl bg-card/95 backdrop-blur-md p-4 transition-all duration-300 border ${
        data.isActive
          ? `${colorScheme.border} ${colorScheme.glow} ring-1 ring-white/20`
          : data.isSelected
          ? 'border-white/40 shadow-lg'
          : 'border-card-border hover:border-white/20'
      }`}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-accent-primary !border-2 !border-background-deep"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-accent-secondary !border-2 !border-background-deep"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg border border-white/10 ${
              data.isActive ? 'bg-white/10' : 'bg-background-surface'
            }`}
          >
            <Icon className="w-5 h-5 text-text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-text-primary flex items-center gap-1.5">
              {data.name}
            </h3>
            <p className="text-[11px] font-medium text-text-muted">{data.role}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Current Task */}
      <div className="my-3 p-2 rounded-lg bg-background-deep/60 border border-white/5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">
          Current Task
        </div>
        <p className="text-xs text-text-primary/90 font-mono truncate">
          {data.currentTask || 'Awaiting supervisor assignment...'}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-text-muted font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-text-subtle" />
          <span>{(data.runtimeMs / 1000).toFixed(1)}s</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-text-subtle" />
          <span>{data.toolCallsCount} tools</span>
        </div>
        <div className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${colorScheme.badgeBg}`}>
          {data.badge.split(' ')[0]}
        </div>
      </div>
    </div>
  );
});

AgentNode.displayName = 'AgentNode';
