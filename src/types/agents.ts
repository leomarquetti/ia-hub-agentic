export type AgentId = 'supervisor' | 'research' | 'analysis' | 'report';

export type AgentStatus =
  | 'IDLE'
  | 'QUEUED'
  | 'PLANNING'
  | 'RUNNING'
  | 'WAITING'
  | 'SUCCESS'
  | 'FAILED'
  | 'PAUSED'
  | 'SIMULATED';

export interface AgentToolInfo {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  category: 'scraping' | 'parsing' | 'normalization' | 'analysis' | 'reporting';
  environment: 'SIMULATED' | 'PRIVATE_RUNTIME';
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  avatarColor: string;
  badge: string;
  framework: string[];
  tools: AgentToolInfo[];
  responsibilities: string[];
}

export interface AgentRuntimeState {
  id: AgentId;
  status: AgentStatus;
  currentTask: string;
  runtimeMs: number;
  toolCallsCount: number;
  lastActiveTimestamp?: string;
  inputSummary?: string;
  outputSummary?: string;
}
