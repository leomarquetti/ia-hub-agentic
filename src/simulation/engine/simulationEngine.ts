import { AgentEvent, MetricSummary } from '@/types/events';
import { AgentMessage } from '@/types/messages';
import { Artifact } from '@/types/artifacts';
import { AgentId } from '@/types/agents';
import { PlaybackSpeed, PlaybackState, WorkflowRunState } from '@/types/workflows';
import { ScenarioDefinition, STANDARD_SCENARIO } from '../scenarios/standardScenario';
import { FAILURE_RECOVERY_SCENARIO } from '../scenarios/failureRecoveryScenario';

export interface SimulationEngineCallbacks {
  onEvent: (event: AgentEvent) => void;
  onMessage: (message: AgentMessage) => void;
  onArtifact: (artifact: Artifact) => void;
  onStateUpdate: (state: WorkflowRunState) => void;
  onMetricsUpdate: (metrics: MetricSummary) => void;
  onComplete: () => void;
}

export class SimulationEngine {
  private scenario: ScenarioDefinition;
  private currentEventIndex: number = 0;
  private currentMessageIndex: number = 0;
  private currentArtifactIndex: number = 0;
  private isPaused: boolean = false;
  private isRunning: boolean = false;
  private speed: PlaybackSpeed = 1;
  private timer: NodeJS.Timeout | null = null;
  private callbacks: SimulationEngineCallbacks;
  private startTime: number = 0;
  private elapsedMs: number = 0;
  private isFailureScenario: boolean = false;

  private state: WorkflowRunState;
  private metrics: MetricSummary;

  constructor(callbacks: SimulationEngineCallbacks) {
    this.callbacks = callbacks;
    this.scenario = STANDARD_SCENARIO;
    this.state = this.getInitialState();
    this.metrics = this.getInitialMetrics();
  }

  private getInitialState(): WorkflowRunState {
    return {
      runId: this.scenario.runId,
      objective: this.scenario.objective,
      playbackState: 'IDLE',
      speed: this.speed,
      viewMode: 'DEFAULT',
      activeAgentId: null,
      selectedAgentId: 'supervisor',
      activeEdgeId: null,
      failureSimulationActive: this.isFailureScenario,
      plan: [
        {
          id: 'step-01',
          agentId: 'research',
          title: 'Extract Competitor Catalogs',
          description: 'Collect pricing matrices from 3 synthetic competitor endpoints.',
          status: 'PENDING',
        },
        {
          id: 'step-02',
          agentId: 'research',
          title: 'Normalize Schemas',
          description: 'Unify tiers and currency structures into Zod schema.',
          status: 'PENDING',
        },
        {
          id: 'step-03',
          agentId: 'analysis',
          title: 'Compute Price Variances & Trends',
          description: 'Isolate price changes, margin shifts and market patterns.',
          status: 'PENDING',
        },
        {
          id: 'step-04',
          agentId: 'report',
          title: 'Synthesize Executive Briefing',
          description: 'Compile executive brief, opportunities and methodology.',
          status: 'PENDING',
        },
      ],
      totalDurationMs: 0,
    };
  }

  private getInitialMetrics(): MetricSummary {
    return {
      runDurationMs: 0,
      agentsExecuted: 0,
      toolCallsCount: 0,
      eventsCount: 0,
      artifactsCount: 0,
      messagesCount: 0,
      status: 'IDLE',
    };
  }

  public setSpeed(speed: PlaybackSpeed) {
    this.speed = speed;
    this.state.speed = speed;
    this.callbacks.onStateUpdate({ ...this.state });
  }

  public loadScenario(isFailure: boolean) {
    this.reset();
    this.isFailureScenario = isFailure;
    this.scenario = isFailure ? FAILURE_RECOVERY_SCENARIO : STANDARD_SCENARIO;
    this.state = this.getInitialState();
    this.callbacks.onStateUpdate({ ...this.state });
  }

  public start() {
    if (this.isRunning && !this.isPaused) return;

    if (this.isPaused) {
      this.isPaused = false;
      this.state.playbackState = 'RUNNING';
      this.callbacks.onStateUpdate({ ...this.state });
      this.scheduleNextStep();
      return;
    }

    this.reset();
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.state.playbackState = 'RUNNING';
    this.state.startedAt = new Date().toISOString();
    this.metrics.status = 'RUNNING';

    this.callbacks.onStateUpdate({ ...this.state });
    this.callbacks.onMetricsUpdate({ ...this.metrics });

    this.scheduleNextStep();
  }

  public pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.state.playbackState = 'PAUSED';
    this.metrics.status = 'PAUSED';
    this.callbacks.onStateUpdate({ ...this.state });
    this.callbacks.onMetricsUpdate({ ...this.metrics });
  }

  public resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.state.playbackState = 'RUNNING';
    this.metrics.status = 'RUNNING';
    this.callbacks.onStateUpdate({ ...this.state });
    this.callbacks.onMetricsUpdate({ ...this.metrics });
    this.scheduleNextStep();
  }

  public reset() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.isPaused = false;
    this.currentEventIndex = 0;
    this.currentMessageIndex = 0;
    this.currentArtifactIndex = 0;
    this.elapsedMs = 0;
    this.state = this.getInitialState();
    this.metrics = this.getInitialMetrics();

    this.callbacks.onStateUpdate({ ...this.state });
    this.callbacks.onMetricsUpdate({ ...this.metrics });
  }

  public replay() {
    this.reset();
    this.start();
  }

  private scheduleNextStep() {
    if (this.isPaused || !this.isRunning) return;

    if (this.currentEventIndex >= this.scenario.events.length) {
      this.completeRun();
      return;
    }

    const currentEvent = this.scenario.events[this.currentEventIndex];
    const baseDelay = this.scenario.delaysMs[this.currentEventIndex] || 800;
    const adjustedDelay = Math.max(100, Math.floor(baseDelay / this.speed));

    this.timer = setTimeout(() => {
      this.executeEvent(currentEvent);
      this.currentEventIndex++;
      this.scheduleNextStep();
    }, adjustedDelay);
  }

  private executeEvent(event: AgentEvent) {
    this.elapsedMs += (this.scenario.delaysMs[this.currentEventIndex] || 800);
    this.metrics.runDurationMs = this.elapsedMs;
    this.metrics.eventsCount = this.currentEventIndex + 1;

    // Update active agent
    this.state.activeAgentId = event.agentId;

    // Update edge animations based on flow
    this.updateActiveEdge(event);

    // Update plan progression
    this.updatePlanProgression(event);

    // Update tool counts
    if (event.eventType === 'tool.completed') {
      this.metrics.toolCallsCount++;
    }

    // Check if new message matches timing
    if (event.eventType === 'message.sent' && this.currentMessageIndex < this.scenario.messages.length) {
      const msg = this.scenario.messages[this.currentMessageIndex];
      this.currentMessageIndex++;
      this.metrics.messagesCount++;
      this.callbacks.onMessage(msg);
    }

    // Check if new artifact matches timing
    if (event.eventType === 'artifact.created' && this.currentArtifactIndex < this.scenario.artifacts.length) {
      const art = this.scenario.artifacts[this.currentArtifactIndex];
      this.currentArtifactIndex++;
      this.metrics.artifactsCount++;
      this.callbacks.onArtifact(art);
    }

    // Compute unique executed agents count
    const uniqueAgents = new Set(
      this.scenario.events.slice(0, this.currentEventIndex + 1).map(e => e.agentId)
    );
    this.metrics.agentsExecuted = uniqueAgents.size;

    // Emit callbacks
    this.callbacks.onEvent(event);
    this.callbacks.onStateUpdate({ ...this.state, totalDurationMs: this.elapsedMs });
    this.callbacks.onMetricsUpdate({ ...this.metrics });
  }

  private updateActiveEdge(event: AgentEvent) {
    if (event.agentId === 'supervisor' && event.eventType === 'message.sent') {
      this.state.activeEdgeId = 'e-supervisor-research';
    } else if (event.agentId === 'research' && event.eventType === 'message.sent') {
      this.state.activeEdgeId = 'e-research-analysis';
    } else if (event.agentId === 'analysis' && event.eventType === 'message.sent') {
      this.state.activeEdgeId = 'e-analysis-report';
    } else if (event.agentId === 'report' && event.eventType === 'message.sent') {
      this.state.activeEdgeId = 'e-report-supervisor';
    }
  }

  private updatePlanProgression(event: AgentEvent) {
    if (event.eventType === 'research.started') {
      this.state.plan[0].status = 'RUNNING';
    } else if (event.eventType === 'dataset.created') {
      this.state.plan[0].status = 'COMPLETED';
      this.state.plan[1].status = 'COMPLETED';
    } else if (event.eventType === 'analysis.started') {
      this.state.plan[2].status = 'RUNNING';
    } else if (event.eventType === 'analysis.completed' || (event.agentId === 'analysis' && event.eventType === 'artifact.created')) {
      this.state.plan[2].status = 'COMPLETED';
    } else if (event.eventType === 'report.started') {
      this.state.plan[3].status = 'RUNNING';
    } else if (event.eventType === 'report.completed' || (event.agentId === 'report' && event.eventType === 'artifact.created')) {
      this.state.plan[3].status = 'COMPLETED';
    }
  }

  private completeRun() {
    this.isRunning = false;
    this.state.playbackState = 'COMPLETED';
    this.state.activeAgentId = null;
    this.state.activeEdgeId = null;
    this.state.completedAt = new Date().toISOString();
    this.metrics.status = 'SUCCESS';

    this.callbacks.onStateUpdate({ ...this.state });
    this.callbacks.onMetricsUpdate({ ...this.metrics });
    this.callbacks.onComplete();
  }
}
