import {Context, Next} from "koa";
import { randomUUID } from "crypto";
import LRUCache from "lru-cache";

export interface LogItem {
  id: string;
  requestTimestamp: number;
  responseTimestamp: number;
  method: Context['method'];
  url: Context['url'];
  status?: number;
  contentType?: string;
  responseSource: string;
  mode: string;
}

export interface RequestDetails {
  requestHeaders: Record<string, string | string[]>;
  responseHeaders: Record<string, string | string[] | number>;
  request: string | Buffer;
  response: string | Buffer;
  logMessages: string[];
}

export class MemoryLogStorage {
  private logs: LogItem[] = [];
  private logLimit: number;
  /**
   * Percentage of how much we allow excess of log limit
   * @private
   */
  private shrinkLogThreshold = 0.1;

  private requestDetails:  LRUCache<string, RequestDetails>;

  constructor(logLimit = 10000) {
    this.logLimit = logLimit;
    this.requestDetails = new LRUCache({
      max: 1000,
      // 100mb
      maxSize: 1000 * 1024 * 1024,
      sizeCalculation: (requestDetails: RequestDetails) =>
        // Don't count headers size, assuming that they have reasonable size
        1000 + (requestDetails.request?.length ?? 0) + (requestDetails.response?.length ?? 0)
    })
  }

  private shrinkLogSize() {
    if (this.logs.length > this.logLimit * (1 + this.shrinkLogThreshold)) {
      this.logs = this.logs.slice(-this.logLimit);
    }
  }

  getItems() {
    return this.logs;
  }

  getRequestDetails(id: string) {
    return this.requestDetails.get(id) ?? null;
  }

  putLogItem(ctx: Context, requestTimestamp: number) {
    const id = randomUUID();

    const logItem: LogItem = {
      id,
      requestTimestamp,
      responseTimestamp: Date.now(),
      method: ctx.method,
      url: ctx.url,
      status: ctx.status,
      contentType: ctx.response.headers['content-type'] as string,
      responseSource: ctx.state.responseSource,
      mode: ctx.state.mockProxyMode
    };

    this.logs.push(logItem);
    this.shrinkLogSize();


    const requestDetails: RequestDetails = {
      requestHeaders: ctx.req.headers,
      responseHeaders: ctx.res.getHeaders(),
      request: ctx.request.body,
      response: (ctx.body || ctx.response.body) as string,
      logMessages: ctx.state.logMessages
    };

    this.requestDetails.set(logItem.id, requestDetails);
  }
}

const storage = new MemoryLogStorage();

export interface LogFilters {
  search?: string;
}

export const getLogs = (filters: LogFilters = {} ) => {
  let items = storage.getItems();

  if (Object.keys(filters).length > 0) {
    items = items.filter(item => {
      if (filters.search) {
        const isFound = item.method.includes(filters.search)
          || item.url.includes(filters.search)
          || item.contentType.includes(filters.search)
          || String(item.method).includes(filters.search);

        if (!isFound) {
          return false;
        }
      }

      return true;
    });
  }

  return items;
}

export const getRequestDetails = (id: string) => {
  return storage.getRequestDetails(id);
};

export const logMiddleware = () => async (ctx: Context, next: Next) => {
  const requestTimestamp = Date.now();
  const nextPromise = next();

  nextPromise.finally(() => {
    storage.putLogItem(ctx, requestTimestamp);
  });

  return nextPromise;
}
