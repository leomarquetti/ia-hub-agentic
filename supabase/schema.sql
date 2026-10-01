-- ============================================================================
-- AGENTIC OPS — AI OPERATIONS CONTROL CENTER
-- PostgreSQL & Supabase Relational Schema
-- ============================================================================
-- This schema models the complete persistence and realtime event architecture
-- for Agentic Ops. In production / private deployments, this enables persistence,
-- auditability, and Supabase Realtime subscriptions.
-- In the Public Portfolio Demo, the web application runs entirely in-memory
-- without requiring Supabase or PostgreSQL credentials.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for future RAG / Knowledge Agent capabilities
CREATE EXTENSION IF NOT EXISTS "vector";

-- ----------------------------------------------------------------------------
-- 1. AGENT_RUNS: Lifecycle tracking for orchestration runs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name VARCHAR(120) NOT NULL,
    objective TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IDLE',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER DEFAULT 0,
    environment VARCHAR(50) NOT NULL DEFAULT 'portfolio_demo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created_at ON agent_runs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. AGENT_EVENTS: Granular execution events and telemetry audit log
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    tool_id VARCHAR(100),
    duration_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_events_run_id ON agent_events(run_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_agent_id ON agent_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_created_at ON agent_events(created_at ASC);

-- ----------------------------------------------------------------------------
-- 3. AGENT_MESSAGES: Structured inter-agent communication stream
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    sender_agent VARCHAR(50) NOT NULL,
    receiver_agent VARCHAR(50) NOT NULL,
    message_type VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_messages_run_id ON agent_messages(run_id);

-- ----------------------------------------------------------------------------
-- 4. AGENT_ARTIFACTS: Published datasets, analyses, and reports
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL,
    artifact_type VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    filename VARCHAR(150) NOT NULL,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'application/json',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_artifacts_run_id ON agent_artifacts(run_id);

-- ----------------------------------------------------------------------------
-- 5. SOURCES: Synthetic or live evidence endpoints
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    domain VARCHAR(200) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    snapshot JSONB DEFAULT '{}'::jsonb,
    checksum VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_run_id ON sources(run_id);

-- ----------------------------------------------------------------------------
-- 6. REPORTS: Executive briefing outputs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    executive_summary TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    disclaimer TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_run_id ON reports(run_id);

-- ----------------------------------------------------------------------------
-- 7. KNOWLEDGE_CHUNKS (RAG Architecture Ready): pgvector embeddings table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_title VARCHAR(255) NOT NULL,
    source_url TEXT,
    content_chunk TEXT NOT NULL,
    embedding VECTOR(1536), -- Standard OpenAI text-embedding-3-small dimension
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW Vector Index for sub-millisecond approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding 
ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Allow public read access for portfolio inspection
CREATE POLICY "Public read demo runs" ON agent_runs FOR SELECT USING (true);
CREATE POLICY "Public read demo events" ON agent_events FOR SELECT USING (true);
CREATE POLICY "Public read demo messages" ON agent_messages FOR SELECT USING (true);
CREATE POLICY "Public read demo artifacts" ON agent_artifacts FOR SELECT USING (true);
CREATE POLICY "Public read demo sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Public read demo reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Public read demo knowledge" ON knowledge_chunks FOR SELECT USING (true);
