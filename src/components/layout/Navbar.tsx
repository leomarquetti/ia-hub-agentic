import React from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  AlertOctagon,
  Code2,
  Tv,
  Network,
  Cpu,
} from 'lucide-react';
import { PlaybackSpeed, PlaybackState, ViewMode } from '@/types/workflows';

interface NavbarProps {
  playbackState: PlaybackState;
  speed: PlaybackSpeed;
  viewMode: ViewMode;
  isFailureActive: boolean;
  onRunDemo: () => void;
  onPause: () => void;
  onResume: () => void;
  onReplay: () => void;
  onReset: () => void;
  onToggleFailure: () => void;
  onSetSpeed: (speed: PlaybackSpeed) => void;
  onToggleTechMode: () => void;
  onTogglePresentationMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  playbackState,
  speed,
  viewMode,
  isFailureActive,
  onRunDemo,
  onPause,
  onResume,
  onReplay,
  onReset,
  onToggleFailure,
  onSetSpeed,
  onToggleTechMode,
  onTogglePresentationMode,
}) => {
  const isRunning = playbackState === 'RUNNING';
  const isPaused = playbackState === 'PAUSED';

  return (
    <header className="w-full bg-card/90 backdrop-blur-md border-b border-card-border px-4 py-3 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Mode Badges */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,92,255,0.4)] group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-text-primary">
                AGENTIC OPS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-text-muted">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-text-muted tracking-wider uppercase font-semibold">
              AI OPERATIONS CONTROL CENTER
            </p>
          </div>
        </Link>

        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background-deep/80 border border-white/10 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-text-primary font-bold text-[11px] tracking-wide">
            PUBLIC PORTFOLIO DEMO
          </span>
          <span className="text-text-subtle">•</span>
          <span className="text-text-muted text-[10px] uppercase font-mono">SIMULATION MODE</span>
        </div>
      </div>

      {/* Center Execution Controls */}
      <div className="flex items-center gap-2">
        {/* Run Demo / Pause / Resume */}
        {!isRunning && !isPaused ? (
          <button
            onClick={onRunDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold text-xs shadow-[0_0_15px_rgba(124,92,255,0.35)] transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN DEMO</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-status-success hover:bg-status-success/90 text-white font-bold text-xs shadow-[0_0_15px_rgba(37,214,149,0.35)] transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RESUME</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-status-warning hover:bg-status-warning/90 text-background-deep font-bold text-xs shadow-[0_0_15px_rgba(245,185,66,0.35)] transition-all active:scale-95"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>PAUSE</span>
          </button>
        )}

        {/* Replay */}
        <button
          onClick={onReplay}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-primary text-xs border border-white/10 transition-colors"
          title="Replay from beginning"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">REPLAY</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary text-xs border border-white/10 transition-colors"
          title="Reset to Initial State"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">RESET</span>
        </button>

        {/* Simulate Failure Button */}
        <button
          onClick={onToggleFailure}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isFailureActive
              ? 'bg-status-danger/20 text-status-danger border-status-danger/40 shadow-[0_0_12px_rgba(255,93,115,0.25)]'
              : 'bg-white/5 hover:bg-white/10 text-text-muted hover:text-status-danger border-white/10'
          }`}
          title="Simulate upstream failure and autonomous supervisor recovery"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">
            {isFailureActive ? 'FAILURE MODE ON' : 'SIMULATE FAILURE'}
          </span>
        </button>

        {/* Speed Controls */}
        <div className="flex items-center bg-background-deep/80 rounded-lg p-0.5 border border-white/10 text-[11px] font-mono">
          {([0.5, 1, 2.5] as PlaybackSpeed[]).map(s => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 rounded-md transition-colors ${
                speed === s
                  ? 'bg-accent-primary text-white font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Right Tools & Mode Toggles */}
      <div className="flex items-center gap-2">
        {/* Tech Mode Toggle */}
        <button
          onClick={onToggleTechMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
            viewMode === 'TECH'
              ? 'bg-accent-secondary/20 text-accent-secondary border-accent-secondary/40 shadow-[0_0_10px_rgba(25,195,255,0.25)]'
              : 'bg-white/5 hover:bg-white/10 text-text-muted border-white/10'
          }`}
          title="Toggle Deep Tech Mode: View Raw Node Events and Payloads"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">TECH MODE</span>
        </button>

        {/* Presentation Mode Toggle */}
        <button
          onClick={onTogglePresentationMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            viewMode === 'PRESENTATION'
              ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
              : 'bg-white/5 hover:bg-white/10 text-text-muted border-white/10'
          }`}
          title="Toggle Clean Presentation Mode for Client Demos"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PRESENTATION</span>
        </button>

        {/* Architecture Map Link */}
        <Link
          href="/architecture"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-primary text-xs font-medium border border-white/10 transition-colors"
        >
          <Network className="w-3.5 h-3.5 text-accent-primary" />
          <span className="hidden md:inline">ARCHITECTURE</span>
        </Link>
      </div>
    </header>
  );
};
