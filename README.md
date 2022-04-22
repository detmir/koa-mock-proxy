# Koa mock proxy

`koa-mock-proxy` is a set of tools for creating proxy servers with possibility for record and replay responses.

This can be useful for:
 * service/integration tests (for example where you want test only frontend)
 * e2e tests where you want to isolate chosen endpoint
 * Manually testing application without backend or for a specific scenario
 * Logging activity between services

You are free to use all possibilities of Koa (custom middlewares like [koa-router](https://www.npmjs.com/package/koa-router)).

## Features
 * Proxy http requests
 * Record requests and responses (body and headers) into human readable files
 * Log proxy requests
 * Manage different test scenarios (depending on a scenario same endpoint can give different response).

## Working modes

Server can work in the following modes:

1. `record`. Server proxy requests to the `proxyUrl` and save responses to file.
2. `replay`. Server read response from file. If there are no matching file, 404 error.
3. `replayOrProxy`. Server read response from file. If there are no matching file, go to `proxyUrl`.
4. `proxy`. Server just proxy to the `proxyUrl`

Mode can be determined :
1. `mode` param to mockProxy middleware
2. Using middleware `mockProxyConfig` (must be defined before `mockProxy` middleware)
3. Using environment variable `KOA_MOCK_PROXY_MODE`

## Examples

The simplest implementation (proxy and record all requests):

```js
  import Koa from 'koa';
  import mockProxy from 'koa-mock-proxy';
  
  const server = new Koa();
  
  server.use(mockProxy({
    proxyUrl: 'http://my-service.com/api'
  }));

  server.listen(9000);
```

Proxy only a specific route:

```js
  import Koa from 'koa';
  import Router from '@koa/router';
  import { mockProxy, mockProxyConfig } from 'koa-mock-proxy';
  
  const server = new Koa();
  server.use(mockProxyConfig({
    proxyUrl: 'http://my-service.com/api'
  }))

  const userRouter = new Router();
  // This route will record or replay depending on global configuration
  userRouter.post(ssoUrl('/users'), mockProxy());

  // This route will replay or proxy
  userRouter.post(ssoUrl('/users'), mockProxy({ mode: 'replayOrProxy' }));

  // this route proxy to custom url
  userRouter.get(ssoUrl('/user/:id'), mockProxy({ 
    mode: 'record',
    proxyUrl: 'http://my-service2.com/api'
  }));
  
  service.use(userRouter);
  
  server.use(koaMockProxy({
    proxyUrl: 'http://my-service.com/api'
  }));
  
  server.listen(9000);
```