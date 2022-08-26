# Koa mock proxy

`koa-mock-proxy` is a tool for creating proxy servers with ability to record and replay responses (mocks).

It can be useful for:
 * service/integration tests (in case you want to test only frontend)
 * e2e tests mocking only chosen endpoints
 * Manually testing application without backend or for a specific scenario that's difficult to reproduce
 * Logging activity between services

You are free to use all possibilities of Koa (custom middlewares like [koa-router](https://www.npmjs.com/package/koa-router)).

## Features
 * Proxy http requests
 * Record requests and responses (body and headers) into human-readable files
 * Log proxy requests, view it using the UI
 * Manage different test scenarios (depending on a scenario, the same endpoint can return different responses).

## Main advantages

 * A public API made in a very familiar way for many JS developers (using middlewares)
 * Recorded mocks are suitable to put in a version control system, easy to understand and update
 * Composability with other libraries and code from custom mocks
 * UI for easier debugging and recording of mocks

## Installation

Install using npm:

```npm i koa-mock-proxy```

Also, it's necessary to install koa, if you don't have it in your project:

```npm i koa```

## Docs

Full docs [are available here](https://detmir.github.io/koa-mock-proxy/)

And [a lot of examples are here](https://detmir.github.io/koa-mock-proxy/docs/examples)

## Debugging

You can set env variable `DEBUG_PROXY=true` if you want to see in console all requests coming through mock server.
