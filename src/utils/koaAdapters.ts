import { Context } from "koa";
import { HttpRequest, HttpResponse } from "../../src/types";
import { stringifyHeaders } from "./stringifyHeaders";

export const getHttpRequestFromCtx = (ctx: Context): HttpRequest => ({
  path: ctx.path,
  method: ctx.method,
  url: ctx.url,
  query: ctx.query,
  headers: ctx.headers,
});

export const getHttpResponseFromCtx = (ctx: Context): HttpResponse => ({
  status: ctx.status,
  headers: stringifyHeaders(ctx.response.headers) ?? {},
  body: ctx.body as string | Buffer,
});
