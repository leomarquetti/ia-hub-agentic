import { NextResponse } from 'next/server';
import { STANDARD_SCENARIO } from '@/simulation/scenarios/standardScenario';
import { redactSensitiveData } from '@/lib/security';

export async function GET() {
  // Return metadata for the primary standard scenario
  const safeData = redactSensitiveData({
    runId: STANDARD_SCENARIO.runId,
    name: STANDARD_SCENARIO.name,
    objective: STANDARD_SCENARIO.objective,
    totalEvents: STANDARD_SCENARIO.events.length,
    totalArtifacts: STANDARD_SCENARIO.artifacts.length,
    environment: 'PORTFOLIO_SIMULATION',
  });

  return NextResponse.json(safeData);
}

export async function POST() {
  return NextResponse.json({
    message: 'Simulation run initiated in portfolio demo mode.',
    runId: STANDARD_SCENARIO.runId,
    status: 'INITIALIZED',
  });
}
