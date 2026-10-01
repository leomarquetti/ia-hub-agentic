import React, { useState } from 'react';
import { UserCheck, ShieldAlert, Check, X } from 'lucide-react';

export const HumanInTheLoopBanner: React.FC = () => {
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  return (
    <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-xs">
      <div className="flex items-center gap-2.5">
        <UserCheck className="w-4 h-4 text-accent-primary shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider">
              Human-in-the-Loop Gateway
            </span>
            <span className="px-1.5 py-0.2 rounded bg-accent-primary/20 text-accent-primary text-[9px] font-bold uppercase tracking-wider border border-accent-primary/30">
              ARCHITECTURE READY
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Supervisor checkpoint: Governance policy can mandate human approval before publishing executive intelligence briefs.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === 'PENDING' ? (
          <>
            <button
              onClick={() => setStatus('APPROVED')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-status-success/20 hover:bg-status-success/30 text-status-success font-medium text-[10px] border border-status-success/30 transition-colors"
            >
              <Check className="w-3 h-3" />
              <span>Simulate Approve</span>
            </button>
            <button
              onClick={() => setStatus('REJECTED')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-status-danger/20 hover:bg-status-danger/30 text-status-danger font-medium text-[10px] border border-status-danger/30 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Simulate Reject</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono">
            <span className="text-text-muted">Checkpoint Status:</span>
            <span
              className={
                status === 'APPROVED' ? 'text-status-success font-bold' : 'text-status-danger font-bold'
              }
            >
              {status}
            </span>
            <button
              onClick={() => setStatus('PENDING')}
              className="ml-1 text-text-subtle hover:text-text-primary underline text-[9px]"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
