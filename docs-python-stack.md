# Python Backend Stack Proposal (Django 5 + PostgreSQL + Redis)

This document proposes a Python backend stack to add robust editing, persistence, and AI-ready capabilities on top of the current frontend-first StudyNotes app.

## Is this possible?

Yes. It is very feasible to add a **Python 3.14 + Django + PostgreSQL + Redis** stack alongside the existing React/Vite frontend.

A pragmatic approach is to keep the current frontend as the reader shell and introduce a separate backend service for:

- document CRUD (notes, versions, snippets)
- auth and permission model
- search and indexing
- asynchronous AI pipelines

## Recommended baseline architecture

- **web**: current Vite React app (unchanged as primary UI shell)
- **api**: Django + Django REST Framework
- **db**: PostgreSQL
- **cache/queue**: Redis
- **workers**: Celery workers (AI tasks, indexing, background processing)

## Suggested Python stack

- Python: **3.14**
- Django: **5.x**
- API: **Django REST Framework**
- DB driver: `psycopg[binary]`
- Redis client: `redis`
- Task queue: `celery`
- Optional scheduling: `django-celery-beat`
- Optional result backend: `django-celery-results`
- LLM/AI orchestration later: LangChain/LlamaIndex or direct provider SDKs

## Why this fits your roadmap

1. **Robust persistence**: PostgreSQL handles structured note data, versioning, and future search indices.
2. **Low frontend overhead**: heavy logic moves server-side; frontend remains responsive.
3. **AI readiness**: Celery + Redis gives clean async boundaries for embeddings, summarization, and long-running jobs.
4. **Incremental migration**: existing static notes can coexist while editable notes move to DB-backed flows.

## Data model (minimal starting point)

- `Document`
  - `id`, `slug`, `title`, `locale`, `status`, `created_at`, `updated_at`
- `DocumentVersion`
  - `id`, `document_id`, `version_number`, `content_json`, `created_by`, `created_at`
- `HtmlSnippet`
  - `id`, `key`, `html`, `is_trusted`, `created_at`, `updated_at`

Notes:

- Use block JSON for core content; render custom HTML snippets as explicit block types.
- For untrusted snippets, sanitize and/or render via sandboxing strategy.

## AI-ready extension points

- `EmbeddingChunk` table (document/version/chunk metadata)
- celery task for chunking + embeddings
- retrieval endpoint for semantic search and QA
- caching layer for inference outputs keyed by document version hash

## Rollout plan (small to robust)

### Phase 1: Foundation

- Add Django service + PostgreSQL + Redis to compose
- Implement health check, auth stub, document CRUD
- Keep frontend routes mostly unchanged

### Phase 2: Editing + versioning

- Add editor route in frontend
- Save block JSON through API
- Add immutable version snapshots and publish workflow

### Phase 3: Search + AI groundwork

- add indexing tasks (Celery)
- add semantic retrieval primitives
- add AI endpoints incrementally (summarize, ask-document)

## Operational guidance

- Keep backend as a separate service boundary from frontend.
- Add migrations from day one.
- Add rate limiting and structured logs for AI endpoints.
- Keep large payloads compressed and versioned.

## Caveats about Python 3.14

Python 3.14 support timing varies by ecosystem package. If any dependency lags, use Python 3.13 temporarily while keeping code compatible with 3.14.

## Decision summary

If your goal is robustness now and AI flexibility later, this stack is a strong choice and can be introduced incrementally without rewriting the current frontend.
