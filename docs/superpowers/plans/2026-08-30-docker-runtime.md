# Docker Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use inline execution for this compact infrastructure task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Docker runtime for the NestJS API and a local PostgreSQL service.

**Architecture:** Use one multi-stage Dockerfile for production API images and one Docker Compose file for local orchestration. The API receives the same `DB_*` variables the existing secret adapter already reads, while PostgreSQL stores data in a named volume.

**Tech Stack:** Docker, Docker Compose, Node.js 25 Alpine, pnpm, PostgreSQL 16 Alpine, NestJS, MikroORM.

## Global Constraints

- Keep the runtime image production-oriented and small.
- Do not auto-run migrations on API boot.
- Use PostgreSQL port `5432`.
- Keep files generic for a reusable template.

---

### Task 1: Production Docker Image

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Interfaces:**
- Consumes: `package.json`, `pnpm-lock.yaml`, `nest-cli.json`, `tsconfig*.json`, `src/`, `mikro-orm.config.js`
- Produces: a container image that runs `node dist/main`

- [x] **Step 1: Create a multi-stage Dockerfile**

Use Node 25 Alpine, install dependencies with pnpm, build `dist`, prune dev dependencies, and run the compiled NestJS app.

- [x] **Step 2: Create .dockerignore**

Exclude local dependencies, build output, logs, VCS metadata, and local env files from the build context.

### Task 2: Local Compose Runtime

**Files:**
- Create: `docker-compose.yml`

**Interfaces:**
- Consumes: Docker image from Task 1
- Produces: `api` and `postgres` services connected on an internal Compose network

- [x] **Step 1: Add postgres service**

Use `postgres:16-alpine`, a named data volume, and `pg_isready` healthcheck.

- [x] **Step 2: Add api service**

Build the local Dockerfile, expose port `3000`, and configure `DB_HOST=postgres`, `DB_PORT=5432`.

### Task 3: Developer Defaults And Docs

**Files:**
- Modify: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: Compose service names and ports from Task 2
- Produces: matching local setup instructions

- [x] **Step 1: Update env example**

Change database defaults to PostgreSQL-compatible values.

- [x] **Step 2: Update README**

Document Docker Compose commands and the manual migration command inside the API container.

### Task 4: Validation

**Files:**
- Test: `Dockerfile`
- Test: `docker-compose.yml`
- Test: `.env.example`

**Interfaces:**
- Consumes: all files from Tasks 1-3
- Produces: a concise verification report

- [x] **Step 1: Run static checks**

Run `docker compose config` when Docker is available, `git diff --check`, and grep for mismatched MySQL defaults.
