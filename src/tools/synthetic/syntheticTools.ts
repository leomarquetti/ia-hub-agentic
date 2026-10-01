import { AgentTool } from '../interfaces/tool.interface';
import { SYNTHETIC_PRODUCTS, SYNTHETIC_SOURCES, SYNTHETIC_FALLBACK_SOURCE } from '@/simulation/fixtures/syntheticData';
import { NormalizedDataset, SyntheticProduct } from '@/schemas/research';

export class SyntheticResearchTool implements AgentTool {
  id = 'tool-browser-research';
  name = 'Browser Research (Synthetic Adapter)';
  description = 'Collects competitor offering snapshots from deterministic synthetic fixtures.';
  category = 'scraping' as const;
  environment = 'SIMULATED' as const;

  async execute(input: { useFallback?: boolean } = {}): Promise<{
    offersExtracted: number;
    sourcesCount: number;
    products: SyntheticProduct[];
  }> {
    // Deterministic simulation
    const products = [...SYNTHETIC_PRODUCTS];
    return {
      offersExtracted: products.length,
      sourcesCount: input.useFallback ? 4 : SYNTHETIC_SOURCES.length,
      products,
    };
  }
}

export class SyntheticPageParser implements AgentTool {
  id = 'tool-page-parser';
  name = 'Page Parser (Synthetic Adapter)';
  description = 'Extracts DOM elements, pricing tiers, and spec matrices from structured documents.';
  category = 'parsing' as const;
  environment = 'SIMULATED' as const;

  async execute(input: { count: number }): Promise<{ parsedTiers: number; status: string }> {
    return {
      parsedTiers: input.count || 53,
      status: 'PARSED_SUCCESSFULLY',
    };
  }
}

export class SyntheticPricingExtractor implements AgentTool {
  id = 'tool-pricing-extractor';
  name = 'Pricing Extractor';
  description = 'Extracts currency, billing cycles, discounts, and historical delta records.';
  category = 'normalization' as const;
  environment = 'SIMULATED' as const;

  async execute(): Promise<{ currenciesHandled: string[]; rawOffersCount: number }> {
    return {
      currenciesHandled: ['USD'],
      rawOffersCount: 53,
    };
  }
}

export class SyntheticDataNormalizer implements AgentTool {
  id = 'tool-data-normalizer';
  name = 'Data Normalizer';
  description = 'Transforms extracted attributes into validated Zod NormalizedDataset records.';
  category = 'normalization' as const;
  environment = 'SIMULATED' as const;

  async execute(runId: string, useFallback = false): Promise<NormalizedDataset> {
    const sources = useFallback
      ? [...SYNTHETIC_SOURCES, SYNTHETIC_FALLBACK_SOURCE]
      : [...SYNTHETIC_SOURCES];

    return {
      runId,
      timestamp: new Date().toISOString(),
      totalOffers: SYNTHETIC_PRODUCTS.length,
      competitorCount: 3,
      sources,
      products: SYNTHETIC_PRODUCTS,
    };
  }
}
