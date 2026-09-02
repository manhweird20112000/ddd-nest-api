# Block Event Loop API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bounded debugging endpoint that synchronously blocks Node.js's event loop for a requested duration.

**Architecture:** Extend the existing `AppController` with `GET /api/debug/block-event-loop`. Parse `durationMs` with Nest's built-in pipes, enforce the `1..10000` range in the controller, then run a synchronous time-based loop and return measured timing data.

**Tech Stack:** NestJS 11, TypeScript, Jest, Supertest.

## Global Constraints

- The route is `GET /api/debug/block-event-loop`.
- `durationMs` defaults to `1000` milliseconds.
- Valid values are integers from `1` through `10000` inclusive.
- Invalid values return HTTP 400.
- The implementation intentionally uses synchronous CPU work and is for development/performance demonstrations only.

---

### Task 1: Add the blocking controller endpoint

**Files:**

- Modify: `src/app.controller.ts`
- Test: `src/app.controller.spec.ts`

**Interfaces:**

- Consumes: `durationMs` query parameter supplied by HTTP clients.
- Produces: `GET /api/debug/block-event-loop` returning `{ requestedDurationMs: number, elapsedDurationMs: number }`.

- [x] **Step 1: Write the focused controller tests**

Create `src/app.controller.spec.ts` with a direct controller test and a mocked `Date.now` sequence so no test waits for a real blocking interval:

```ts
import { BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';

describe('AppController', () => {
  it('blocks for the default duration', () => {
    const controller = new AppController();
    const now = jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000);

    expect(controller.blockEventLoop()).toEqual({
      requestedDurationMs: 1000,
      elapsedDurationMs: 1000,
    });

    now.mockRestore();
  });

  it('blocks for a valid requested duration', () => {
    const controller = new AppController();
    const now = jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1250);

    expect(controller.blockEventLoop(250)).toEqual({
      requestedDurationMs: 250,
      elapsedDurationMs: 250,
    });

    now.mockRestore();
  });

  it.each([0, 10001])('rejects duration %i', (durationMs) => {
    const controller = new AppController();

    expect(() => controller.blockEventLoop(durationMs)).toThrow(
      BadRequestException,
    );
  });
});
```

- [x] **Step 2: Run the focused test and verify it fails**

Run: `pnpm exec jest src/app.controller.spec.ts --runInBand`
Expected: FAIL because `blockEventLoop` is not yet defined.

- [x] **Step 3: Implement the minimal endpoint**

Update `src/app.controller.ts` to import `BadRequestException`, `DefaultValuePipe`, `ParseIntPipe`, and `Query`, then add:

```ts
  @Get('debug/block-event-loop')
  blockEventLoop(
    @Query('durationMs', new DefaultValuePipe(1000), ParseIntPipe)
    durationMs = 1000,
  ) {
    if (durationMs < 1 || durationMs > 10000) {
      throw new BadRequestException('durationMs must be between 1 and 10000');
    }

    const startedAt = Date.now();
    const deadline = startedAt + durationMs;

    while (Date.now() < deadline) {
      // Intentionally synchronous: this demonstrates event-loop blocking.
    }

    return {
      requestedDurationMs: durationMs,
      elapsedDurationMs: Date.now() - startedAt,
    };
  }
```

- [x] **Step 4: Run the focused test and verify it passes**

Run: `pnpm exec jest src/app.controller.spec.ts --runInBand`
Expected: PASS with all controller tests passing.

- [x] **Step 5: Run type/build validation**

Run: `pnpm build`
Expected: Nest build completes without TypeScript errors.
