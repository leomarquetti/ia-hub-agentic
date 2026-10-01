import { AgentId } from './agents';

export type ArtifactType = 'dataset' | 'analysis' | 'report' | 'sources';

export interface Artifact {
  id: string;
  name: string;
  filename: string;
  artifactType: ArtifactType;
  creatorAgent: AgentId;
  createdAt: string;
  sizeBytes: number;
  itemCountSummary: string; // e.g. "53 products", "7 price changes", "1 executive report"
  content: string; // serialized JSON or Markdown string
  mimeType: 'application/json' | 'text/markdown';
  metadata: Record<string, unknown>;
}
