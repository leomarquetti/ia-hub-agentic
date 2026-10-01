import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

interface PayloadModalProps {
  isOpen: boolean;
  title: string;
  payload: unknown;
  onClose: () => void;
}

export const PayloadModal: React.FC<PayloadModalProps> = ({
  isOpen,
  title,
  payload,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString =
    typeof payload === 'string'
      ? payload
      : JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-deep/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-card rounded-2xl border border-card-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-background-deep/60">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-accent-secondary" />
            <h3 className="text-xs font-bold font-mono text-text-primary truncate max-w-md">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary text-[11px] font-mono transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-status-success" />
                  <span className="text-status-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-background-deep font-mono text-xs text-text-primary">
          <pre className="text-[11px] leading-relaxed text-text-primary/90 whitespace-pre-wrap break-all">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/10 bg-background-deep/60 text-[10px] text-text-subtle font-mono">
          <span>Structured Output Schema Inspector</span>
          <span>Validated with Zod</span>
        </div>
      </div>
    </div>
  );
};
