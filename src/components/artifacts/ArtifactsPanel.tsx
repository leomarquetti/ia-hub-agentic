import React, { useState } from 'react';
import {
  FolderArchive,
  FileCode,
  FileText,
  Eye,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import { Artifact } from '@/types/artifacts';

interface ArtifactsPanelProps {
  artifacts: Artifact[];
  onViewArtifact: (artifact: Artifact) => void;
}

export const ArtifactsPanel: React.FC<ArtifactsPanelProps> = ({
  artifacts,
  onViewArtifact,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (art: Artifact) => {
    navigator.clipboard.writeText(art.content);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (art: Artifact) => {
    const blob = new Blob([art.content], { type: art.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_${art.filename}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col bg-card/90 backdrop-blur-md rounded-2xl border border-card-border overflow-hidden p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FolderArchive className="w-4 h-4 text-status-success" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Execution Artifacts
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          {artifacts.length} published
        </span>
      </div>

      {/* Artifact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {artifacts.length === 0 ? (
          <div className="col-span-2 py-6 text-center text-text-muted text-xs">
            Artifacts will appear as agents compile structured outputs.
          </div>
        ) : (
          artifacts.map(art => {
            const isMarkdown = art.artifactType === 'report';
            const Icon = isMarkdown ? FileText : FileCode;

            return (
              <div
                key={art.id}
                className="p-3 rounded-xl bg-background-deep/60 border border-white/5 flex flex-col justify-between space-y-2 hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-accent-secondary shrink-0" />
                      <span className="text-xs font-bold font-mono text-text-primary truncate">
                        {art.filename}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-subtle shrink-0">
                      {(art.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted truncate">
                    {art.itemCountSummary}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onViewArtifact(art)}
                    className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-white/5 hover:bg-white/10 text-text-primary text-[10px] font-medium transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleCopy(art)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-text-muted text-[10px] transition-colors"
                    title="Copy Content"
                  >
                    {copiedId === art.id ? (
                      <Check className="w-3 h-3 text-status-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(art)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-text-muted text-[10px] transition-colors"
                    title="Download Synthetic Artifact"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
