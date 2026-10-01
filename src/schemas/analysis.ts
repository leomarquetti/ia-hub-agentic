import { z } from 'zod';

export const PriceChangeSchema = z.object({
  id: z.string(),
  competitorName: z.string(),
  productName: z.string(),
  oldPrice: z.number(),
  newPrice: z.number(),
  deltaAbsolute: z.number(),
  deltaPercent: z.number(),
  direction: z.enum(['INCREASE', 'DECREASE', 'UNCHANGED']),
  detectedAt: z.string(),
  implication: z.string(),
});

export const MarketPatternSchema = z.object({
  id: z.string(),
  category: z.enum(['PRICING_AGGRESSION', 'FEATURE_BUNDLING', 'TIER_MIGRATION', 'DISCOUNT_PRESSURE']),
  title: z.string(),
  description: z.string(),
  confidenceScore: z.number().min(0).max(1),
  affectedCompetitors: z.array(z.string()),
});

export const StrategicOpportunitySchema = z.object({
  id: z.string(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'EXPLORATORY']),
  title: z.string(),
  actionableRecommendation: z.string(),
  estimatedImpact: z.string(),
  timeframe: z.enum(['IMMEDIATE_7_DAYS', 'SHORT_TERM_30_DAYS', 'STRATEGIC_Q2']),
});

export const AnalysisFindingSchema = z.object({
  id: z.string(),
  summary: z.string(),
  severity: z.enum(['INFO', 'ATTENTION', 'ALERT']),
  supportingDataPoints: z.number(),
});

export const AnalysisOutputSchema = z.object({
  runId: z.string(),
  analyzedAt: z.string(),
  totalProductsCompared: z.number(),
  averagePriceVariancePercent: z.number(),
  findings: z.array(AnalysisFindingSchema),
  price_changes: z.array(PriceChangeSchema),
  market_patterns: z.array(MarketPatternSchema),
  opportunities: z.array(StrategicOpportunitySchema),
});

export type PriceChange = z.infer<typeof PriceChangeSchema>;
export type MarketPattern = z.infer<typeof MarketPatternSchema>;
export type StrategicOpportunity = z.infer<typeof StrategicOpportunitySchema>;
export type AnalysisFinding = z.infer<typeof AnalysisFindingSchema>;
export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;
