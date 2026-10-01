import React from 'react';
import {
  X,
  FileCheck2,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
} from 'lucide-react';
import {
  SYNTHETIC_PRICE_CHANGES,
  SYNTHETIC_MARKET_PATTERNS,
  SYNTHETIC_STRATEGIC_OPPORTUNITIES,
} from '@/simulation/fixtures/syntheticData';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const downloadReport = () => {
    const reportText = document.getElementById('report-markdown-content')?.innerText || '';
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synthetic_executive_report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-deep/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl border border-card-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background-deep/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-accent-primary">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary">
                  Executive Intelligence Report
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                  SYNTHETIC DEMO DATA
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Multi-Agent Competitive Intelligence Assessment • Workflow Converged Successfully
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-primary text-xs font-medium border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Document */}
        <div
          id="report-markdown-content"
          className="flex-1 overflow-y-auto p-8 space-y-8 text-text-primary font-sans text-sm leading-relaxed"
        >
          {/* Executive Watermark Banner */}
          <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-text-primary uppercase tracking-wide">
                Portfolio Demonstration Disclaimer
              </span>
              <p className="text-text-muted">
                All companies (Velora Systems, Kinetiq Works, Northwind Digital), pricing tiers, products, and sources analyzed in this report are entirely fictional. Generated via deterministic multi-agent simulation using LangGraph architecture and Zod structured schema outputs.
              </p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-accent-secondary font-mono">01.</span> Executive Summary
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Agentic Ops concluded an autonomous multi-agent competitive analysis. The workflow decomposed the business objective into specialized subagent tasks, orchestrating data extraction across 53 synthetic products and 3 target competitors. The key finding is an aggressive <strong>mid-tier subscription compression</strong> (-18.4% average decrease), counterbalanced by steep infrastructure margin expansion (+28% to +44%) on telemetry and egress services.
            </p>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-background-deep/80 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-text-muted">Analyzed Offers</div>
                <div className="text-xl font-bold font-mono text-accent-secondary">53 SKUs</div>
                <div className="text-[10px] text-text-subtle">3 Competitors</div>
              </div>
              <div className="p-3 rounded-xl bg-background-deep/80 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-text-muted">Price Revisions</div>
                <div className="text-xl font-bold font-mono text-status-warning">7 Detected</div>
                <div className="text-[10px] text-text-subtle">5 cuts / 2 hikes</div>
              </div>
              <div className="p-3 rounded-xl bg-background-deep/80 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-text-muted">Market Patterns</div>
                <div className="text-xl font-bold font-mono text-status-success">4 Trends</div>
                <div className="text-[10px] text-text-subtle">High Confidence</div>
              </div>
              <div className="p-3 rounded-xl bg-background-deep/80 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-text-muted">Strategic Opps</div>
                <div className="text-xl font-bold font-mono text-accent-primary">3 Actions</div>
                <div className="text-[10px] text-text-subtle">Prioritized Matrix</div>
              </div>
            </div>
          </section>

          {/* Section 2: Competitive Overview */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-accent-secondary font-mono">02.</span> Competitive Landscape
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-text-muted uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Competitor Entity</th>
                    <th className="py-2.5 px-3">Competitive Tier</th>
                    <th className="py-2.5 px-3">Products Extracted</th>
                    <th className="py-2.5 px-3">Pricing Stance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-text-primary">Velora Systems</td>
                    <td className="py-2.5 px-3 text-accent-primary">Tier-1 Direct</td>
                    <td className="py-2.5 px-3">21 catalog items</td>
                    <td className="py-2.5 px-3 text-status-success">Aggressive discount on entry plans</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-text-primary">Kinetiq Works</td>
                    <td className="py-2.5 px-3 text-accent-secondary">Tier-2 Challenger</td>
                    <td className="py-2.5 px-3">18 catalog items</td>
                    <td className="py-2.5 px-3 text-status-warning">Shifted margin to telemetry add-ons</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-text-primary">Northwind Digital</td>
                    <td className="py-2.5 px-3 text-text-muted">Tier-3 Niche</td>
                    <td className="py-2.5 px-3">14 catalog items</td>
                    <td className="py-2.5 px-3 text-status-danger">+28.5% hike on cross-cloud mirror</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Pricing Movements */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-accent-secondary font-mono">03.</span> Significant Pricing Movements
            </h3>
            <div className="space-y-2">
              {SYNTHETIC_PRICE_CHANGES.map(pc => {
                const isDown = pc.direction === 'DECREASE';
                const Icon = isDown ? TrendingDown : TrendingUp;
                const color = isDown ? 'text-status-success' : 'text-status-danger';

                return (
                  <div
                    key={pc.id}
                    className="p-3 rounded-xl bg-background-deep/60 border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">
                          {pc.competitorName} • <span className="font-mono text-text-muted">{pc.productName}</span>
                        </div>
                        <div className="text-[11px] text-text-muted font-sans">
                          {pc.implication}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs text-text-subtle line-through">${pc.oldPrice}</div>
                      <div className={`text-sm font-bold ${color}`}>
                        ${pc.newPrice}/mo ({pc.deltaPercent > 0 ? `+${pc.deltaPercent}%` : `${pc.deltaPercent}%`})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Market Patterns */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-accent-secondary font-mono">04.</span> Discovered Market Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SYNTHETIC_MARKET_PATTERNS.map(pat => (
                <div
                  key={pat.id}
                  className="p-3.5 rounded-xl bg-background-deep/60 border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent-secondary px-1.5 py-0.5 rounded bg-accent-secondary/10 border border-accent-secondary/20">
                      {pat.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-status-success">
                      {(pat.confidenceScore * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-text-primary">{pat.title}</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">{pat.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Strategic Opportunities */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-accent-secondary font-mono">05.</span> Strategic Recommendations & Opportunities
            </h3>
            <div className="space-y-2.5">
              {SYNTHETIC_STRATEGIC_OPPORTUNITIES.map(opp => (
                <div
                  key={opp.id}
                  className="p-3.5 rounded-xl bg-background-deep/60 border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        opp.priority === 'CRITICAL'
                          ? 'bg-status-danger/20 text-status-danger border border-status-danger/30'
                          : opp.priority === 'HIGH'
                          ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                          : 'bg-white/10 text-text-muted'
                      }`}>
                        {opp.priority} PRIORITY
                      </span>
                      <span className="text-xs font-bold text-text-primary">{opp.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-subtle">
                      Timeframe: {opp.timeframe.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{opp.actionableRecommendation}</p>
                  <div className="text-[11px] font-mono text-accent-secondary font-medium">
                    → Expected Impact: {opp.estimatedImpact}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Methodology & Architecture Trace */}
          <section className="space-y-2 p-4 rounded-xl bg-background-deep/80 border border-white/5 text-xs text-text-muted">
            <div className="font-bold uppercase tracking-wider text-text-primary text-[10px]">
              Execution Methodology & Reproducibility Trace
            </div>
            <p>
              Generated by Agentic Ops Multi-Agent Supervisor workflow. Nodes executed: Supervisor Node → Research Node → Analysis Node → Report Node. Output contracts enforced via Zod schemas. Deterministic simulation guarantees identical execution metrics for portfolio evaluation.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-background-deep/60 text-xs text-text-muted">
          <span className="font-mono text-[11px]">Run ID: run-standard-demo-01</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white font-medium transition-colors text-xs"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
