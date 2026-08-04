# Design: Docker Compose + Remove REST Modules

**Date:** 2026-08-04  
**Status:** Approved (pending implementation)  
**Approach:** Minimal (Postgres-only compose + delete REST-based feature modules)

## Goal

1. Add local Postgres via Docker Compose so the Nest app can run with `pnpm start:dev` against a containerized DB.
2. Remove feature modules that expose REST APIs (`user`, `admin`, `admin-auth`), including GraphQL surfaces that live inside those modules.

## Non-goals

- No Dockerfile / Nest app container.
- No Redis, queue, or extra infra services.
- No GraphQL login/admin rewrite after module deletion.
- No broad REST infra cleanup (Swagger, URI versioning, global prefix) beyond what breaks the build.

## Decisions

| Topic | Choice | Rationale |
|-------|--------|-----------|
| REST cleanup scope | Delete entire `user`, `admin`, `admin-auth` modules | User option B |
| Compose scope | Postgres only | User option A |
| App runtime | Local (`pnpm start:dev`) | Matches compose-only-DB |
| Empty module shell | Keep `ContainerModules` with `imports: []` | Preserves import site in `AppModule` without extra churn |

## Docker Compose

**File:** `docker-compose.yml` (repo root)

- Service name: `postgres`
- Image: `postgres:16-alpine`
- Ports: `5432:5432`
- Environment:
  - `POSTGRES_USER` ← aligns with `DB_USER`
  - `POSTGRES_PASSWORD` ← aligns with `DB_PASSWORD`
  - `POSTGRES_DB` ← aligns with `DB_NAME`
- Volume: named volume `postgres_data` → `/var/lib/postgresql/data`
- Healthcheck: `pg_isready -U $POSTGRES_USER -d $POSTGRES_DB`

**`.env.example` updates:**

- `DB_HOST=127.0.0.1`
- `DB_PORT=5432` (fix current `3306` mismatch; app uses Postgres)
- Keep `DB_USER` / `DB_PASSWORD` / `DB_NAME` values that compose will mirror (document that compose env must match)

Default compose credentials should match `.env.example` so `docker compose up -d` + copy `.env.example` → `.env` works without edits.

## Module removal

**Delete directories:**

- `src/modules/user/`
- `src/modules/admin/`
- `src/modules/admin-auth/`

**Update:**

- `src/modules/index.ts` — remove imports of the three modules; `imports: []`
- `src/app.module.ts` — keep `ContainerModules` import (no change required if shell remains)

**Out of scope cleanup (do not touch unless build fails):**

- `.agents/` example snippets referencing admin/user
- Generic `scripts/run-seeder.js` (path-based; harmless without seeders)
- Shared HTTP filters/interceptors/prefix/versioning

## Resulting app shape

- Nest boots with: Secret, Database, GraphQL, Winston, ServeStatic, empty `ContainerModules`, `AppController`
- No feature REST controllers
- No admin GraphQL resolvers
- GraphQL module may have zero resolvers — acceptable for this template reset

## Verification

1. `docker compose config` validates
2. `pnpm build` succeeds after module deletion
3. App starts against compose Postgres when `.env` matches compose credentials

## Rollback

```bash
git checkout -- docker-compose.yml .env.example src/modules src/app.module.ts
# If directories were deleted and committed, restore from prior commit:
# git checkout HEAD~1 -- src/modules/user src/modules/admin src/modules/admin-auth
docker compose down -v
```
