import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AgentEvent } from '@/types/events';
import { AgentId } from '@/types/agents';

interface LiveEventStreamProps {
  events: AgentEvent[];
  isTechMode: boolean;
  onViewPayload: (title: string, payload: unknown) => void;
}

const AGENT_BADGES: Record<AgentId, { bg: string; text: string }> = {
  supervisor: { bg: 'bg-[#7C5CFF]/15', text: 'text-[#A58FFF]' },
  research: { bg: 'bg-[#19C3FF]/15', text: 'text-[#63D8FF]' },
  analysis: { bg: 'bg-[#25D695]/15', text: 'text-[#5EF4BC]' },
  report: { bg: 'bg-[#F5B942]/15', text: 'text-[#FED078]' },
};

export const LiveEventStream: React.FC<LiveEventStreamProps> = ({
  events,
  isTechMode,
  onViewPayload,
}) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const filteredEvents = events.filter(evt => {
    if (filterAgent !== 'all' && evt.agentId !== filterAgent) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        evt.message.toLowerCase().includes(q) ||
        evt.eventType.toLowerCase().includes(q) ||
        evt.agentId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full flex flex-col bg-card/90 backdrop-blur-md rounded-2xl border border-card-border overflow-hidden transition-all duration-300">
      {/* Stream Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background-deep/40">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-accent-secondary" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Live Execution Event Stream
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-text-muted border border-white/10">
            {events.length} events
          </span>
          {isTechMode && (
            <span className="px-2 py-0.5 rounded-full bg-accent-primary/20 text-[10px] font-mono text-accent-primary border border-accent-primary/30">
              TECH MODE ACTIVE
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Agent Filter */}
          <div className="flex items-center gap-1.5 bg-background-surface/80 px-2 py-1 rounded-lg border border-white/10 text-xs">
            <Filter className="w-3 h-3 text-text-muted" />
            <select
              value={filterAgent}
              onChange={e => setFilterAgent(e.target.value)}
              className="bg-transparent text-text-muted text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="all">All Agents</option>
              <option value="supervisor">Supervisor</option>
              <option value="research">Research</option>
              <option value="analysis">Analysis</option>
              <option value="report">Report</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-subtle" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1 text-[11px] bg-background-surface/80 rounded-lg border border-white/10 text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent-primary/50 w-36"
            />
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-white/5 text-text-muted"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stream Content */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="h-48 overflow-y-auto p-3 font-mono text-xs space-y-1.5 scroll-smooth divide-y divide-white/[0.03]"
        >
          {filteredEvents.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-muted text-xs font-sans">
              Awaiting run initialization. Click &ldquo;Run Demo&rdquo; to start execution.
            </div>
          ) : (
            filteredEvents.map(evt => {
              const badge = AGENT_BADGES[evt.agentId] || AGENT_BADGES.supervisor;
              const isError = evt.eventType === 'tool.failed' || evt.status === 'FAILED';
              const isSuccess = evt.status === 'SUCCESS';

              return (
                <div
                  key={evt.id}
                  className={`pt-1.5 pb-1 flex items-start justify-between gap-3 px-2 rounded hover:bg-white/[0.03] transition-colors ${
                    isError ? 'bg-status-danger/10 border-l-2 border-status-danger' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <span className="text-[11px] text-text-subtle whitespace-nowrap">
                      {evt.timestamp}
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${badge.bg} ${badge.text} shrink-0`}
                    >
                      {evt.agentId}
                    </span>

                    {isTechMode && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-accent-secondary border border-white/5 shrink-0">
                        {evt.eventType}
                      </span>
                    )}

                    <span className="text-text-primary text-[11px] break-words">
                      {evt.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px] text-text-muted">
                    {evt.durationMs !== undefined && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-subtle" />
                        {evt.durationMs}ms
                      </span>
                    )}

                    {isTechMode && (evt.payload || evt.metadata) && (
                      <button
                        onClick={() =>
                          onViewPayload(
                            `Event Payload: ${evt.eventType}`,
                            evt.payload || evt.metadata
                          )
                        }
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-accent-secondary border border-white/10 transition-colors"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>PAYLOAD</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
