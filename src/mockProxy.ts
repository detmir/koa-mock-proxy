import { Context, Next } from "koa";
import { MockProxyOptions, MockProxyUserOptions } from "./types";
import { getCombinedOptions } from "./getCombinedOptions";
import { proxyMiddleware } from "./proxyMiddleware";

export const mockProxy = (options: MockProxyUserOptions) => {
  return async (ctx: Context, next: Next) => {
    const combinedOptions = getCombinedOptions(ctx, options);

    const canProxy = [
      "record",
      "replayOrProxy",
      "proxy",
    ] as MockProxyOptions["mode"][];

    if (canProxy) {
      await proxyMiddleware(combinedOptions)(ctx, next);
    }
  };
};
