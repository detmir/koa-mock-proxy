import { Context } from "koa";

export type MockProxyUserOptions = Partial<MockProxyOptions>;

export interface MockProxyOptions {
  /**
   * Mode determines how mock server handles incoming requests
   * "record" - Server proxy requests to the targetUrl and save responses
   * "replay" - Server read response from file. If there are no matching file, 404 error.
   * "replayOrProxy". Server read response from file. If there are no matching file, go to targetUrl.
   */
  mode: "record" | "replay" | "replayOrProxy" | "proxy";
  /**
   * An url where a mock server proxy request.
   * Required for all modes except "replay"
   */
  targetUrl: string;
  /**
   * A base directory for all mocks
   * Required for all modes except "proxy
   */
  mocksDirectory: string | null;
  recordOptions: {
    /**
     * A prefix for file url depending on working mode
     * You can use different postfixes depending on a scenario or an incoming request (request body, headers, etc)
     */
    getFilenamePostfix?: (ctx: Context) => string;
  };
}
