import { Context } from "koa";

export type MockProxyUserOptions = Partial<MockProxyOptions>;

export interface MockProxyOptions {
  mode: "record" | "replay" | "replayOrProxy" | "proxy";
  targetUrl: string;
  mocksDirectory: string | null;
  recordOptions: {
    getFilenamePostfix?: (ctx: Context) => string;
  };
}
