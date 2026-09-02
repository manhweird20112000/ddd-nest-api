# Block Event Loop API

## Goal

Provide a local-only style debugging endpoint that intentionally blocks Node.js's event loop for a bounded duration, making the behavior observable during demos.

## API

- Method: `GET`
- Path: `/api/debug/block-event-loop`
- Query: `durationMs`, default `1000`
- Valid range: `1` through `10000` milliseconds, inclusive
- Invalid values return `400 Bad Request`
- Successful response reports the requested and measured blocking duration

## Implementation

Keep the endpoint in `AppController` because this is a small debugging surface and the application already exposes its root controller. Validate the query value with Nest pipes and an explicit range check. Use a synchronous `Date.now()` loop in the handler so the Node.js event loop cannot process other work until the duration expires.

## Testing

Add focused controller tests covering the default duration, a valid bounded duration, and values outside the accepted range. Avoid a 10-second test; use a small duration and mock the clock or assert the response contract so the suite stays fast.

## Safety

The hard upper bound is 10 seconds per request. This endpoint is intended for development and performance demonstrations and should not be exposed as a normal production workload endpoint.

The debug controller is registered only when `NODE_ENV=development`. Production deployments must set `NODE_ENV=production`; in that environment the route is not registered and responds with `404`.
