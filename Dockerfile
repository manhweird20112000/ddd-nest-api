# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY nest-cli.json tsconfig.json tsconfig.build.json .swcrc ./
COPY src ./src
RUN npm run build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV APP_PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

COPY --from=builder /app/dist ./dist
RUN mkdir -p storages

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${APP_PORT}/health" || exit 1

CMD ["node", "dist/main.js"]
