import { AgentId } from './agents';

export type PlaybackState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';

export type PlaybackSpeed = 0.5 | 1 | 2.5;

export type ViewMode = 'DEFAULT' | 'TECH' | 'PRESENTATION';

export interface WorkflowPlanStep {
  id: string;
  agentId: AgentId;
  title: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface WorkflowRunState {
  runId: string;
  objective: string;
  playbackState: PlaybackState;
  speed: PlaybackSpeed;
  viewMode: ViewMode;
  activeAgentId: AgentId | null;
  selectedAgentId: AgentId | null;
  activeEdgeId: string | null;
  failureSimulationActive: boolean;
  plan: WorkflowPlanStep[];
  startedAt?: string;
  completedAt?: string;
  totalDurationMs: number;
}
