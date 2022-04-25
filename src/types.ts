import { Context } from "koa";

export type MockProxyUserOptions = Partial<MockProxyOptions>;

export interface MockProxyOptions {
  mode: "record" | "replay" | "replayOrProxy" | "proxy";
  targetUrl: string;
  recordDirectory: string | null;
  getMockFilename?: (mockFilenameOptions: {
    basename: string;
    extension: string;
    ctx: Context;
  }) => string;
}
