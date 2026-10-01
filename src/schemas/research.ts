import { z } from 'zod';

export const CompetitorTierSchema = z.enum(['tier_1_direct', 'tier_2_challenger', 'tier_3_niche']);

export const SyntheticProductSchema = z.object({
  id: z.string(),
  competitorName: z.string(),
  productName: z.string(),
  sku: z.string(),
  tier: CompetitorTierSchema,
  currentPrice: z.number(),
  previousPrice: z.number(),
  currency: z.string().default('USD'),
  billingModel: z.enum(['per_user_monthly', 'flat_rate', 'usage_based']),
  discountApplied: z.boolean(),
  discountPercentage: z.number().optional(),
  featureHighlights: z.array(z.string()),
  urlSynthetic: z.string(),
  lastObserved: z.string(),
});

export const SyntheticSourceSchema = z.object({
  id: z.string(),
  domain: z.string(),
  sourceName: z.string(),
  sourceType: z.enum(['pricing_page', 'changelog', 'product_announcement']),
  status: z.enum(['active_mirror', 'fallback_mirror']),
  offersExtracted: z.number(),
  checksum: z.string(),
});

export const NormalizedDatasetSchema = z.object({
  runId: z.string(),
  timestamp: z.string(),
  totalOffers: z.number(),
  competitorCount: z.number(),
  sources: z.array(SyntheticSourceSchema),
  products: z.array(SyntheticProductSchema),
});

export type SyntheticProduct = z.infer<typeof SyntheticProductSchema>;
export type SyntheticSource = z.infer<typeof SyntheticSourceSchema>;
export type NormalizedDataset = z.infer<typeof NormalizedDatasetSchema>;
