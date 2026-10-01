import { ScenarioDefinition, STANDARD_SCENARIO } from './standardScenario';
import { AgentEvent } from '@/types/events';
import { AgentMessage } from '@/types/messages';

const FAILURE_RUN_ID = 'run-failure-recovery-demo-02';

// We inject a simulated tool failure event in research, supervisor detects error, retries with fallback mirror, and resumes
const failureEvents: AgentEvent[] = [
  {
    id: 'f-evt-01',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:00',
    agentId: 'supervisor',
    eventType: 'run.created',
    status: 'PLANNING',
    message: 'Run initialized: [FAILURE RECOVERY MODE] Testing resilient error self-healing.',
    durationMs: 40,
  },
  {
    id: 'f-evt-02',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:01',
    agentId: 'supervisor',
    eventType: 'supervisor.started',
    status: 'PLANNING',
    message: 'Supervisor queuing tasks with failover watchdog policy.',
    durationMs: 380,
  },
  {
    id: 'f-evt-03',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:02',
    agentId: 'supervisor',
    eventType: 'message.sent',
    status: 'RUNNING',
    message: 'Supervisor delegating scraping to Research Agent (Primary Synthetic Mirror).',
    durationMs: 150,
  },
  {
    id: 'f-evt-04',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:03',
    agentId: 'research',
    eventType: 'research.started',
    status: 'RUNNING',
    message: 'Research Agent activated on primary synthetic mirror.',
    durationMs: 220,
  },
  {
    id: 'f-evt-05',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:04',
    agentId: 'research',
    eventType: 'tool.started',
    status: 'RUNNING',
    toolId: 'tool-browser-research',
    message: 'Tool Browser Research started: Querying primary synthetic endpoint.',
    durationMs: 110,
  },
  // THE SIMULATED FAILURE OCCURS HERE
  {
    id: 'f-evt-06',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:06',
    agentId: 'research',
    eventType: 'tool.failed',
    status: 'FAILED',
    toolId: 'tool-browser-research',
    message: 'Tool Failure Detected: Primary synthetic mirror returned connection timeout (504 Gateway Timeout).',
    durationMs: 2100,
    metadata: { errorType: 'SIMULATED_UPSTREAM_TIMEOUT', endpoint: 'velora-systems.synthetic' },
  },
  {
    id: 'f-evt-07',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:07',
    agentId: 'supervisor',
    eventType: 'error.detected',
    status: 'PLANNING',
    message: 'Supervisor Watchdog Intercepted Tool Failure in node [research]. Halting failure cascade.',
    durationMs: 310,
    metadata: { recoveryStrategy: 'ACTIVATE_FALLBACK_CACHE_MIRROR', maxRetries: 3, currentAttempt: 1 },
  },
  {
    id: 'f-evt-08',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:08',
    agentId: 'supervisor',
    eventType: 'recovery.started',
    status: 'RUNNING',
    message: 'Self-Healing Routing: Supervisor issuing directive to switch to Encrypted Fallback Synthetic Mirror.',
    durationMs: 260,
  },
  {
    id: 'f-evt-09',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:09',
    agentId: 'research',
    eventType: 'tool.started',
    status: 'RUNNING',
    toolId: 'tool-browser-research',
    message: 'Tool Browser Research retry attempt #2: Querying backup-cache.synthetic.internal.',
    durationMs: 140,
  },
  {
    id: 'f-evt-10',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:11',
    agentId: 'research',
    eventType: 'tool.completed',
    status: 'RUNNING',
    toolId: 'tool-browser-research',
    message: 'Tool Browser Research completed via fallback cache: 53 synthetic offers recovered.',
    durationMs: 1650,
  },
  {
    id: 'f-evt-11',
    runId: FAILURE_RUN_ID,
    timestamp: '08:20:12',
    agentId: 'supervisor',
    eventType: 'recovery.completed',
    status: 'RUNNING',
    message: 'Supervisor confirmed self-healing recovery: Workflow graph resuming normal execution path.',
    durationMs: 290,
  },
  // Workflow resumes normal path from analysis
  ...STANDARD_SCENARIO.events.slice(11).map((evt, idx) => ({
    ...evt,
    id: `f-evt-${idx + 12}`,
    runId: FAILURE_RUN_ID,
  })),
];

const failureMessages: AgentMessage[] = [
  {
    id: 'f-msg-01',
    runId: FAILURE_RUN_ID,
    sender: 'supervisor',
    receiver: 'research',
    timestamp: '2026-10-01T08:20:02Z',
    type: 'TASK_DELEGATION',
    summary: 'Extract pricing data from primary synthetic mirror.',
    payload: { target: 'primary_mirror' },
  },
  {
    id: 'f-msg-02',
    runId: FAILURE_RUN_ID,
    sender: 'research',
    receiver: 'supervisor',
    timestamp: '2026-10-01T08:20:06Z',
    type: 'ERROR_NOTIFICATION',
    summary: 'ALERT: Upstream timeout (504) on primary mirror. Awaiting supervisor instruction.',
    payload: { errorCode: 'ERR_TIMEOUT_504', failingNode: 'tool-browser-research' },
  },
  {
    id: 'f-msg-03',
    runId: FAILURE_RUN_ID,
    sender: 'supervisor',
    receiver: 'research',
    timestamp: '2026-10-01T08:20:08Z',
    type: 'FAILOVER_DIRECTIVE',
    summary: 'FAILOVER APPROVED: Reroute scraping to Encrypted Fallback Mirror (backup-cache.synthetic.internal).',
    payload: { fallbackDomain: 'backup-cache.synthetic.internal', retryAttempt: 2 },
  },
  ...STANDARD_SCENARIO.messages.slice(1).map((msg, idx) => ({
    ...msg,
    id: `f-msg-${idx + 4}`,
    runId: FAILURE_RUN_ID,
  })),
];

export const FAILURE_RECOVERY_SCENARIO: ScenarioDefinition = {
  runId: FAILURE_RUN_ID,
  name: 'Failure Self-Healing Recovery Demo',
  objective: 'Demonstrate resilience: handle synthetic tool timeout, execute Supervisor error detection, retry with fallback mirror and finish report.',
  artifacts: STANDARD_SCENARIO.artifacts.map(art => ({ ...art, runId: FAILURE_RUN_ID })),
  messages: failureMessages,
  events: failureEvents,
  delaysMs: [
    800,  // f-evt-01
    900,  // f-evt-02
    800,  // f-evt-03
    900,  // f-evt-04
    700,  // f-evt-05
    1800, // f-evt-06 (FAILURE)
    1200, // f-evt-07 (SUPERVISOR DETECTS ERROR)
    1200, // f-evt-08 (RECOVERY DIRECTIVE)
    700,  // f-evt-09 (RETRY TOOL STARTED)
    1600, // f-evt-10 (RETRY SUCCESS)
    1000, // f-evt-11 (RECOVERY COMPLETED)
    ...STANDARD_SCENARIO.delaysMs.slice(11),
  ],
};
