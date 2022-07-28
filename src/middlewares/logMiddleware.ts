import {Context, Next} from "koa";

interface LogItem {
  requestTimestamp: number;
  responseTimestamp: number;
  method: Context['method'];
  url: Context['url'];
}

export class MemoryLogStorage {
  private logs: LogItem[];
  private logLimit: number;
  /**
   * Percentage of how much we allow excess of log limit
   * @private
   */
  private shrinkLogThreshold = 0.1;

  constructor(logLimit = 10000) {
    this.logs = [];
    this.logLimit = logLimit;
  }

  private shrinkLogSize() {
    if (this.logs.length > this.logLimit * (1 + this.shrinkLogThreshold)) {
      this.logs = this.logs.slice(-this.logLimit);
    }
  }

  getItems() {
    return this.logs;
  }

  putLogItem(ctx: Context, requestTimestamp: number) {
    const logItem: LogItem = {
      requestTimestamp,
      responseTimestamp: Date.now(),
      method: ctx.method,
      url: ctx.url
    }

    this.logs.push(logItem);
    this.shrinkLogSize();
  }
}

const storage = new MemoryLogStorage();

export const getLogs = () => storage.getItems();

export const logMiddleware = () => async (ctx: Context, next: Next) => {
  const requestTimestamp = Date.now();
  const nextPromise = next();

  nextPromise.finally(() => {
    storage.putLogItem(ctx, requestTimestamp);
  });

  return nextPromise;
}
