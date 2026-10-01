export interface AgentTool<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  description: string;
  category: 'scraping' | 'parsing' | 'normalization' | 'analysis' | 'reporting';
  environment: 'SIMULATED' | 'PRIVATE_RUNTIME';
  execute(input: TInput): Promise<TOutput>;
}

export interface ResearchToolInput {
  targetDomain: string;
  category: string;
  maxOffers?: number;
}

export interface ResearchToolOutput {
  success: boolean;
  offersExtracted: number;
  domain: string;
  rawPayload: unknown;
  durationMs: number;
}
