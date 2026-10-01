import React from 'react';
import { ArrowRight, MessageSquareCode, Code2 } from 'lucide-react';
import { AgentMessage } from '@/types/messages';
import { AgentId } from '@/types/agents';

interface CommunicationStreamProps {
  messages: AgentMessage[];
  onViewPayload: (title: string, payload: unknown) => void;
}

const AGENT_LABELS: Record<AgentId, { name: string; color: string }> = {
  supervisor: { name: 'SUPERVISOR', color: 'text-[#A58FFF]' },
  research: { name: 'RESEARCH', color: 'text-[#63D8FF]' },
  analysis: { name: 'ANALYSIS', color: 'text-[#5EF4BC]' },
  report: { name: 'REPORT', color: 'text-[#FED078]' },
};

export const CommunicationStream: React.FC<CommunicationStreamProps> = ({
  messages,
  onViewPayload,
}) => {
  return (
    <div className="w-full flex flex-col bg-card/90 backdrop-blur-md rounded-2xl border border-card-border overflow-hidden p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4 text-accent-secondary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Agent Communication Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          {messages.length} messages
        </span>
      </div>

      {/* Message List */}
      <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="py-6 text-center text-text-muted text-xs">
            No inter-agent messages exchanged yet.
          </div>
        ) : (
          messages.map(msg => {
            const sender = AGENT_LABELS[msg.sender] || AGENT_LABELS.supervisor;
            const receiver = AGENT_LABELS[msg.receiver] || AGENT_LABELS.research;

            return (
              <div
                key={msg.id}
                className="p-2.5 rounded-xl bg-background-deep/60 border border-white/5 space-y-1.5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold font-mono">
                    <span className={sender.color}>{sender.name}</span>
                    <ArrowRight className="w-3 h-3 text-text-subtle" />
                    <span className={receiver.color}>{receiver.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-subtle font-mono">
                      {msg.timestamp.split('T')[1]?.slice(0, 8) || msg.timestamp}
                    </span>
                    <button
                      onClick={() =>
                        onViewPayload(
                          `${sender.name} → ${receiver.name} [${msg.type}]`,
                          msg.payload
                        )
                      }
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary text-[10px] font-mono transition-colors border border-accent-primary/20"
                    >
                      <Code2 className="w-3 h-3" />
                      <span>VIEW PAYLOAD</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text-primary font-mono leading-relaxed">
                  &ldquo;{msg.summary}&rdquo;
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
