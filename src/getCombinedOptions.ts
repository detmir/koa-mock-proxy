import { MockProxyOptions, MockProxyUserOptions } from "./types";
import { Context } from "koa";

export const getCombinedOptions = (
  ctx: Context,
  middlewareOptions: MockProxyUserOptions
): MockProxyOptions => {
  // todo: extract options from env variables
  const combinedOptions: MockProxyOptions = {
    ...(ctx.mockProxyConfig ?? {}),
    ...(middlewareOptions ?? {}),
  };

  if (combinedOptions.mode !== "replay" && !combinedOptions.targetUrl) {
    throw new Error("Target url is required!");
  }

  return {
    mode: combinedOptions.mode || "record",
    targetUrl: combinedOptions.targetUrl || "",
    mocksDirectory: combinedOptions.mocksDirectory || null,
    getMockFilename: combinedOptions.getMockFilename,
  };
};
