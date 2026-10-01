# RAG & Semantic Retrieval Architecture — Agentic Ops

## 1. Overview
While the primary demonstration workflow focuses on Competitive Intelligence and structured price extraction, the system architecture is pre-configured for **Retrieval-Augmented Generation (RAG)** and semantic memory expansion.

---

## 2. PostgreSQL + pgvector Schema
The database layer (`supabase/schema.sql`) includes pre-provisioned vector infrastructure:

```sql
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_title VARCHAR(255) NOT NULL,
    source_url TEXT,
    content_chunk TEXT NOT NULL,
    embedding VECTOR(1536), -- Compatible with OpenAI text-embedding-3-small
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding 
ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);
```

---

## 3. Knowledge Agent Integration
When enabled in private environments, the **Knowledge Agent**:
1. Accepts unstructured filings, annual reports, and product docs.
2. Generates semantic embeddings with chunk overlap.
3. Performs hybrid lexical (BM25) and dense vector (Cosine HNSW) queries.
4. Injects verified factual context into the Supervisor and Analysis agents.
