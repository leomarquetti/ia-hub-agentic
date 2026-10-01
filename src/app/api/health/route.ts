import { NextResponse } from 'next/server';
import { publicConfig } from '@/lib/env';

export async function GET() {
  return NextResponse.json({
    status: 'HEALTHY',
    system: 'Agentic Ops Control Center',
    mode: publicConfig.appMode,
    isSyntheticData: publicConfig.isSyntheticData,
    timestamp: new Date().toISOString(),
  });
}
