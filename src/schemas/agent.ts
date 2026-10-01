import { z } from 'zod';

export const AgentIdSchema = z.enum(['supervisor', 'research', 'analysis', 'report']);

export const AgentStatusSchema = z.enum([
  'IDLE',
  'QUEUED',
  'PLANNING',
  'RUNNING',
  'WAITING',
  'SUCCESS',
  'FAILED',
  'PAUSED',
  'SIMULATED',
]);

export const ToolCategorySchema = z.enum([
  'scraping',
  'parsing',
  'normalization',
  'analysis',
  'reporting',
]);

export const AgentToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['IDLE', 'RUNNING', 'SUCCESS', 'FAILED']),
  category: ToolCategorySchema,
  environment: z.enum(['SIMULATED', 'PRIVATE_RUNTIME']),
});

export const AgentDefinitionSchema = z.object({
  id: AgentIdSchema,
  name: z.string(),
  role: z.string(),
  description: z.string(),
  avatarColor: z.string(),
  badge: z.string(),
  framework: z.array(z.string()),
  tools: z.array(AgentToolSchema),
  responsibilities: z.array(z.string()),
});
