import { z } from 'zod';
import { AgentIdSchema, AgentStatusSchema } from './agent';

export const EventTypeSchema = z.enum([
  'run.created',
  'supervisor.started',
  'plan.created',
  'research.started',
  'tool.started',
  'tool.completed',
  'tool.failed',
  'dataset.created',
  'message.sent',
  'analysis.started',
  'analysis.completed',
  'report.started',
  'artifact.created',
  'report.completed',
  'error.detected',
  'recovery.started',
  'recovery.completed',
  'run.completed',
  'run.paused',
  'run.resumed',
]);

export const AgentEventSchema = z.object({
  id: z.string(),
  runId: z.string(),
  timestamp: z.string(),
  agentId: AgentIdSchema,
  eventType: EventTypeSchema,
  status: AgentStatusSchema,
  message: z.string(),
  toolId: z.string().optional(),
  durationMs: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
  payload: z.unknown().optional(),
});
