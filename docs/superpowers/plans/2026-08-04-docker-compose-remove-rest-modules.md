# Docker Compose + Remove REST Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Postgres-only Docker Compose and delete the `user`, `admin`, and `admin-auth` feature modules so the template boots without REST feature APIs.

**Architecture:** Local Nest app (`pnpm start:dev`) talks to a compose-managed Postgres on `127.0.0.1:5432`. Feature modules that owned REST (and their nested GraphQL) are removed entirely. `ContainerModules` stays as an empty shell. A one-line GraphQL health query keeps Apollo schema valid with no feature resolvers.

**Tech Stack:** Docker Compose, Postgres 16 Alpine, NestJS 11, TypeORM, `@nestjs/graphql` + Apollo

**Spec:** `docs/superpowers/specs/2026-08-04-docker-compose-remove-rest-modules-design.md`

## Global Constraints

- Compose services: Postgres only (no app container, no Redis).
- Delete entire modules: `user`, `admin`, `admin-auth` (including GraphQL inside them).
- Keep `ContainerModules` with `imports: []`.
- Do not touch `.agents/` examples or `scripts/run-seeder.js` unless the build fails.
- Do not remove global REST plumbing (prefix, versioning, filters) unless required to compile.
- Commits: only when the user explicitly asks (skip commit steps until then).
- Credentials in compose must match `.env.example`: user `root`, password `123456xX`, db `test`, port `5432`.

## File Structure

| File | Responsibility |
|------|----------------|
| `docker-compose.yml` | Postgres service, volume, healthcheck, ports |
| `.env.example` | Local env template aligned to compose Postgres |
| `src/modules/index.ts` | Empty feature-module container |
| `src/modules/user/` | DELETE |
| `src/modules/admin/` | DELETE |
| `src/modules/admin-auth/` | DELETE |
| `src/infra/graphql/health.resolver.ts` | Minimal `health` Query so schema boots |
| `src/infra/graphql/graphql.module.ts` | Register health resolver |

---

### Task 1: Postgres Docker Compose + env alignment

**Files:**
- Create: `docker-compose.yml`
- Modify: `.env.example`

**Interfaces:**
- Consumes: none
- Produces: Compose service `postgres` on host port `5432`; env vars `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` matching compose

- [ ] **Step 1: Create `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: ddd-nest-api-postgres
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: 123456xX
      POSTGRES_DB: test
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U root -d test']
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

- [ ] **Step 2: Update `.env.example` to Postgres port `5432`**

Replace file contents with:

```env
APP_NAME="LOCAL"
APP_PORT="3000"

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=root
DB_PASSWORD=123456xX
DB_NAME=test
DB_SYNC=true

JWT_SECRET=dinhvanmanh
TOKEN_EXPIRATION=1000d
```

- [ ] **Step 3: Validate compose file**

Run: `docker compose config`
Expected: prints merged config; exit code `0`

- [ ] **Step 4: Commit (skip unless user asked)**

```bash
git add docker-compose.yml .env.example
git commit -m "$(cat <<'EOF'
chore: add postgres docker compose for local dev

EOF
)"
```

---

### Task 2: Delete REST feature modules + keep GraphQL bootable

**Files:**
- Delete: `src/modules/user/` (entire directory)
- Delete: `src/modules/admin/` (entire directory)
- Delete: `src/modules/admin-auth/` (entire directory)
- Modify: `src/modules/index.ts`
- Create: `src/infra/graphql/health.resolver.ts`
- Modify: `src/infra/graphql/graphql.module.ts`

**Interfaces:**
- Consumes: Task 1 env/compose (for later runtime check only)
- Produces: `ContainerModules` with empty `imports`; `HealthResolver.getHealth(): string` registered in `GraphqlModule`

- [ ] **Step 1: Empty `src/modules/index.ts`**

```typescript
import { Module } from '@nestjs/common';

@Module({
  imports: [],
})
export class ContainerModules {}
```

- [ ] **Step 2: Delete the three feature module directories**

Run:

```bash
rm -rf src/modules/user src/modules/admin src/modules/admin-auth
```

Expected: those three paths no longer exist; `src/modules/index.ts` remains.

- [ ] **Step 3: Create `src/infra/graphql/health.resolver.ts`**

```typescript
import { Query, Resolver } from '@nestjs/graphql';

/**
 * Keeps the GraphQL schema valid when no feature resolvers are registered.
 */
@Resolver()
export class HealthResolver {
  @Query(() => String, { name: 'health' })
  getHealth(): string {
    return 'ok';
  }
}
```

- [ ] **Step 4: Register resolver in `src/infra/graphql/graphql.module.ts`**

Replace file contents with:

```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { buildGraphqlConfig } from './graphql.config';
import { HealthResolver } from './health.resolver';

/**
 * Wires the code-first GraphQL endpoint at `/graphql`.
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...buildGraphqlConfig(),
    }),
  ],
  providers: [HealthResolver],
})
export class GraphqlModule {}
```

- [ ] **Step 5: Verify no remaining source imports of deleted modules**

Run:

```bash
rg "modules/(user|admin|admin-auth)|UserModule|AdminModule|AdminAuthModule" src --glob '*.ts'
```

Expected: no matches under `src/`

- [ ] **Step 6: Build**

Run: `pnpm build`
Expected: exit code `0`; Nest compile succeeds

- [ ] **Step 7: Commit (skip unless user asked)**

```bash
git add src/modules/index.ts src/infra/graphql/health.resolver.ts src/infra/graphql/graphql.module.ts
git add -u src/modules/user src/modules/admin src/modules/admin-auth
git commit -m "$(cat <<'EOF'
chore: remove REST feature modules; keep GraphQL health query

EOF
)"
```

---

### Task 3: Smoke-check compose + app config wiring

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: Task 1 compose credentials; Task 2 empty modules + health resolver
- Produces: confirmation that compose starts and build still passes

- [ ] **Step 1: Start Postgres**

Run: `docker compose up -d`
Expected: container `ddd-nest-api-postgres` running / healthy

- [ ] **Step 2: Confirm readiness**

Run: `docker compose ps`
Expected: `postgres` shows healthy (or running with health status)

- [ ] **Step 3: Re-run build as regression check**

Run: `pnpm build`
Expected: exit code `0`

- [ ] **Step 4: Optional local boot (if `.env` already matches `.env.example`)**

Run: `pnpm start` (or `timeout 15 pnpm start` then stop)
Expected: Nest listens on `APP_PORT` without missing-module errors

- [ ] **Step 5: Commit (none — verification only)**

---

## Spec coverage self-check

| Spec requirement | Task |
|------------------|------|
| `docker-compose.yml` Postgres 16 alpine, 5432, volume, healthcheck | Task 1 |
| `.env.example` DB_PORT=5432 aligned with compose | Task 1 |
| Delete `user`, `admin`, `admin-auth` | Task 2 |
| `ContainerModules` with `imports: []` | Task 2 |
| App still boots with GraphQL present | Task 2 health resolver + Task 3 |
| Verify compose + build | Task 1 Step 3, Task 2 Step 6, Task 3 |

**Note:** Spec said zero resolvers were acceptable; Nest/Apollo requires a Query root, so Task 2 adds a minimal `health` query (smallest fix that keeps GraphQL in `AppModule`).
