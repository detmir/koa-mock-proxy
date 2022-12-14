import { MockProxyOptions, MockProxyUserOptions } from "../types";
import { Context } from "koa";

const validateOptions = (options: MockProxyOptions) => {
  if (options.mode !== "replay" && !options.targetUrl) {
    throw new Error(
      `targetUrl parameter is required for ${options.mode} mode!`
    );
  }

  if (options.mode !== "proxy" && !options.mocksDirectory) {
    throw new Error("mocksDirectory is required!");
  }

  const availableModes: typeof options["mode"][] = [
    "record",
    "replay",
    "replayOrProxy",
    "replayOrRecord",
    "proxy",
  ];

  if (!availableModes.includes(options.mode)) {
    throw new Error(
      `Mode ${options.mode} is invalid! Valid modes: ${availableModes.join(
        ","
      )}`
    );
  }
};

export const getCombinedOptions = (
  ctx: Context,
  middlewareOptions: MockProxyUserOptions
): MockProxyOptions => {
  const defaultOptions = {
    mode: process.env.KOA_MOCK_PROXY_MODE ?? "replayOrProxy",
    targetUrl: process.env.KOA_MOCK_PROXY_TARGET_URL ?? "",
    mocksDirectory: process.env.KOA_MOCK_PROXY_DIRECTORY ?? null,
    recordOptions: {},
  };

  const combinedOptions: MockProxyOptions = {
    ...defaultOptions,
    ...(ctx.mockProxyConfig ?? {}),
    ...(middlewareOptions ?? {}),
  };

  validateOptions(combinedOptions);

  return combinedOptions;
};
