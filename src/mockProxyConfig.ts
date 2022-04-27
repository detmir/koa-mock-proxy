import { Context } from "koa";
import { MockProxyUserOptions } from "./types";

export const mockProxyConfig = (options: MockProxyUserOptions) => {
  return async (ctx: Context, next) => {
    if (!ctx.mockProxyConfig) {
      ctx.mockProxyConfig = options;
    } else {
      ctx.mockProxyConfig = {
        ...mockProxyConfig,
        ...options,
      };
    }

    return next();
  };
};
