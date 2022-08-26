# Examples

## The simplest implementation
(Server proxies and records all requests)

```js
import Koa from 'koa';
import { mockProxyMiddleware } from '@detmir/koa-mock-proxy';

const server = new Koa();

server.use(mockProxyMiddleware({
  mocksDirectory: './mocks/',
  targetUrl: 'http://my-service.com/api'
}));

server.listen(9000);

```

## Proxy only a specific route:

```js
  import Koa from 'koa';
  import Router from '@koa/router';
  import { mockProxy, mockProxyConfig } from 'koa-mock-proxy';

  const server = new Koa();
  server.use(mockProxyConfig({
    targetUrl: 'http://my-service.com/api'
  }))

  const userRouter = new Router();
  // This route will record or replay depending on global configuration
  userRouter.post('/users', mockProxy());

  // This route will replay or proxy
  userRouter.post('/users', mockProxy({ mode: 'replayOrProxy' }));

  // this route proxy to custom url
  userRouter.get('/user/:id', mockProxy({
    mode: 'record',
    targetUrl: 'http://my-service2.com/api'
  }));

  server.use(userRouter.routes());

  server.use(koaMockProxy({
    targetUrl: 'http://my-service.com/api'
  }));

  server.listen(9000);
```

## More complex examples

### [Mocks structure](https://github.com/detmir/koa-mock-proxy/tree/main/examples/01%20-%20mocksStructure)

### [Mocks recording](https://github.com/detmir/koa-mock-proxy/tree/main/examples/02%20-%20recordMocks)

### [Mocks scenarios](https://github.com/detmir/koa-mock-proxy/tree/main/examples/03%20-%20mocksScenarios)
