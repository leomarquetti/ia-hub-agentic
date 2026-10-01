import React, { useState } from 'react';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Server,
  Headphones,
  TrendingUp,
  Database,
  Megaphone,
} from 'lucide-react';

const FUTURE_AGENTS_LIST = [
  {
    id: 'it-ops',
    name: 'IT OPERATIONS AGENT',
    role: 'Site Reliability & Incident Response',
    description: 'Autonomous incident triage, log root-cause analysis, and infrastructure remediation playbooks.',
    icon: Server,
    framework: 'LangGraph + OpenTelemetry',
  },
  {
    id: 'customer-support',
    name: 'CUSTOMER SUPPORT AGENT',
    role: 'Omnichannel Resolution Specialist',
    description: 'Human-in-the-loop escalation routing, sentiment classification, and personalized customer ticket deflection.',
    icon: Headphones,
    framework: 'LangChain + Vector Retrieval',
  },
  {
    id: 'sales-intel',
    name: 'SALES INTELLIGENCE AGENT',
    role: 'Pipeline & Account Enrichment',
    description: 'Prospect firmographics discovery, buying intent scoring, and competitor win-loss analysis.',
    icon: TrendingUp,
    framework: 'LangGraph + CRM Tool Calling',
  },
  {
    id: 'knowledge-agent',
    name: 'KNOWLEDGE AGENT (RAG)',
    role: 'Semantic Context Retrieval',
    description: 'Enterprise document indexing with pgvector, hybrid vector-lexical search, and grounding verification.',
    icon: Database,
    framework: 'PostgreSQL + pgvector',
  },
  {
    id: 'marketing-intel',
    name: 'MARKETING INTELLIGENCE AGENT',
    role: 'Campaign & Audience Analytics',
    description: 'Cross-channel attribution modeling, ad copy performance clustering, and seasonal trend forecasting.',
    icon: Megaphone,
    framework: 'LangChain OutputParsers',
  },
];

export const FutureAgentsSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-card/80 backdrop-blur-md rounded-2xl border border-card-border overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-text-muted">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Horizontal Expansion — Future Agents
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 text-text-muted border border-white/10">
                ARCHITECTURE READY • NOT ACTIVE IN DEMO
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Pre-architected multi-agent modules designed for enterprise extension beyond Competitive Intelligence.
            </p>
          </div>
        </div>

        <div className="p-1 text-text-muted">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Cards */}
      {isOpen && (
        <div className="p-5 border-t border-white/5 bg-background-deep/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in duration-200">
          {FUTURE_AGENTS_LIST.map(agent => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-background-surface/40 border border-white/5 relative overflow-hidden flex flex-col justify-between space-y-3 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary">{agent.name}</h4>
                        <span className="text-[10px] text-text-muted">{agent.role}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                  <span className="font-mono text-text-subtle">{agent.framework}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted font-bold tracking-wider uppercase text-[8px]">
                    LOCKED / READY
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
