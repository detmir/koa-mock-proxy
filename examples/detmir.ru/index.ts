import Koa from 'koa';
import {mockProxyMiddleware} from '../../src';
import Router from "@koa/router";
import {isTextContentType} from "../../src/utils/isTextContentType";

const server = new Koa();

const detmirRouter = new Router();

const convertProxyResponse = (response, ctx) => {
  if (isTextContentType(ctx.response.get("content-type"))) {
    const newString = response.toString('utf-8')
      // @ts-ignore
      .replaceAll('https://www.detmir.ru', 'http://localhost:9000')
      .replaceAll('https://go.detmir.st/js', 'http://localhost:9000/js')
      .replaceAll('api.detmir.ru', 'localhost:9000/api');

    return Buffer.from(newString, 'utf-8')
  }

  return response;
};

detmirRouter.all(['/js/(.*)','/css/(.*)'], mockProxyMiddleware({
  targetUrl: 'https://www.detmir.st/',
  mocksDirectory: './mocks',
  mode: 'record',
  recordOptions: {
    overwrite: true
  },
  convertProxyResponse
}));

detmirRouter.all('(.*)', mockProxyMiddleware({
  targetUrl: 'https://www.detmir.ru/',
  mocksDirectory: './mocks',
  mode: 'record',
  recordOptions: {
    overwrite: true
  },
  convertProxyResponse
}));

detmirRouter.all('/api/(.*)', mockProxyMiddleware({
  targetUrl: 'https://api.detmir.ru/',
  mocksDirectory: './mocks',
  mode: 'replayOrProxy',
  recordOptions: {
    overwrite: true
  },
  convertProxyResponse
}));

server.use(detmirRouter.routes());


server.listen(9000);
