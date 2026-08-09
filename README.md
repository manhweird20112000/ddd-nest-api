# Auth Service

NestJS **auth microservice** (hybrid): HTTP API + TCP message patterns. Clean Architecture (Domain → Application → Interface → Infrastructure).

Docs: [NestJS Microservices basics](https://docs.nestjs.com/microservices/basics)

## Stack

- NestJS 11, TypeScript
- TypeORM + PostgreSQL
- JWT (`@nestjs/jwt`)
- Hybrid transport: HTTP + TCP
- Winston logging, Swagger-ready layout
- Docker Compose (app + Postgres)

## Prerequisites

- Node.js 20+
- Yarn
- Docker & Docker Compose (optional, recommended)
- PostgreSQL 12+ (if chạy local không Docker)

## Quick start (Docker)

```bash
cp .env.example .env
# chỉnh JWT_SECRET / DB_* nếu cần

docker compose up -d --build
```

| Service        | URL / port                          |
|----------------|-------------------------------------|
| HTTP API       | `http://localhost:3000`             |
| TCP microservice | `localhost:3001`                  |
| Postgres       | `localhost:5432`                    |
| Health/root    | `GET /`                             |

Logs:

```bash
docker compose logs -f auth-service
```

Stop:

```bash
docker compose down
```

## Local development (without Docker)

```bash
cp .env.example .env
yarn install
# đảm bảo Postgres đang chạy và khớp DB_* trong .env
yarn start:dev
```

HTTP: `APP_PORT` (default `3000`)  
TCP: `MS_HOST` / `MS_PORT` (default `0.0.0.0:3001`)

## Environment

| Variable           | Description                          | Default        |
|--------------------|--------------------------------------|----------------|
| `APP_NAME`         | Service name                         | `auth-service` |
| `APP_PORT`         | HTTP listen port                     | `3000`         |
| `MS_HOST`          | TCP bind host                        | `0.0.0.0`      |
| `MS_PORT`          | TCP listen port                      | `3001`         |
| `DB_HOST`          | Postgres host                        | `127.0.0.1`    |
| `DB_PORT`          | Postgres port                        | `5432`         |
| `DB_USER`          | Postgres user                        | `postgres`     |
| `DB_PASSWORD`      | Postgres password                    | —              |
| `DB_NAME`          | Database name                        | `auth_service` |
| `DB_SYNC`          | TypeORM synchronize (`true`/`false`) | `true`         |
| `JWT_SECRET`       | JWT signing secret                   | —              |
| `TOKEN_EXPIRATION` | Access/refresh token TTL             | `7d`           |

Trong Docker Compose, `DB_HOST` được override thành `postgres`.

## User Auth (placeholder)

In-memory user (no DB yet):

| Field    | Value               |
|----------|---------------------|
| id       | `1`                 |
| email    | `user@example.com`  |
| password | `password123`       |

### HTTP

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "password123" }
```

Response:

```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

### TCP Message Patterns

Gateway / client gọi TCP (`MS_PORT`):

| Pattern                         | Payload               | Result                            |
|---------------------------------|-----------------------|-----------------------------------|
| `{ cmd: 'user.auth.login' }`    | `{ email, password }` | `{ access_token, refresh_token }` |
| `{ cmd: 'user.auth.validate' }` | `{ token }`           | `{ sub, email }`                  |

Ví dụ client NestJS:

```typescript
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const client = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: { host: '127.0.0.1', port: 3001 },
});

await client.connect();
const tokens = await firstValueFrom(
  client.send(
    { cmd: 'user.auth.login' },
    { email: 'user@example.com', password: 'password123' },
  ),
);
const payload = await firstValueFrom(
  client.send({ cmd: 'user.auth.validate' }, { token: tokens.access_token }),
);
```

Lỗi credentials / token invalid trả về `RpcException`.

## Scripts

```bash
yarn start:dev      # watch mode
yarn start:debug    # debug
yarn build          # compile
yarn start:prod     # node dist/main
yarn test           # unit tests
yarn test:e2e       # e2e
yarn lint
yarn migration:run  # after yarn build
yarn seed:run
```

## Project structure

```
src/
├── modules/           # Feature modules (user-auth, ...)
│   └── [module]/
│       ├── domain/
│       ├── application/
│       ├── interface/     # HTTP controllers + MS controllers
│       └── infrastructure/
├── shared/
├── infra/             # config, database, secret, logging
├── app.module.ts
└── main.ts            # Hybrid HTTP + TCP bootstrap
```

## Architecture notes

- **Hybrid app**: `NestFactory.create` + `connectMicroservice(Transport.TCP)` + `startAllMicroservices()` + `listen()`.
- **Use cases** stay in Application; MS controller chỉ adapt payload ↔ use case / JWT port.
- Dependencies point inward (Clean Architecture).

## License

UNLICENSED / private.
