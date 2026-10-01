import { AgentId } from './agents';

export interface AgentMessage {
  id: string;
  runId: string;
  sender: AgentId;
  receiver: AgentId;
  timestamp: string;
  type: string;
  summary: string;
  payload: Record<string, unknown>;
}
