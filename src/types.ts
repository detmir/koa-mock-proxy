export type MockProxyUserOptions = Partial<MockProxyOptions>;

export interface MockProxyOptions {
  mode: "record" | "replay" | "replayOrProxy" | "proxy";
  targetUrl: string;
}
