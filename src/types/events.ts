import { AgentId, AgentStatus } from './agents';

export type EventType =
  | 'run.created'
  | 'supervisor.started'
  | 'plan.created'
  | 'research.started'
  | 'tool.started'
  | 'tool.completed'
  | 'tool.failed'
  | 'dataset.created'
  | 'message.sent'
  | 'analysis.started'
  | 'analysis.completed'
  | 'report.started'
  | 'artifact.created'
  | 'report.completed'
  | 'error.detected'
  | 'recovery.started'
  | 'recovery.completed'
  | 'run.completed'
  | 'run.paused'
  | 'run.resumed';

export interface AgentEvent {
  id: string;
  runId: string;
  timestamp: string; // ISO or formatted
  agentId: AgentId;
  eventType: EventType;
  status: AgentStatus;
  message: string;
  toolId?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  payload?: unknown;
}

export interface MetricSummary {
  runDurationMs: number;
  agentsExecuted: number;
  toolCallsCount: number;
  eventsCount: number;
  artifactsCount: number;
  messagesCount: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'SUCCESS' | 'FAILED';
}
