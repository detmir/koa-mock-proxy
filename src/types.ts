import { Context } from "koa";
import { OutgoingHttpHeaders } from "http";

export interface HttpRequest {
  path: string;
  method: string;
  url: string;
  query: NodeJS.Dict<string | string[]>;
  headers: Context["headers"];
}

export interface HttpResponse {
  status: number;
  headers: Record<string, string | string[]>;
  body: string | Buffer;
}

export type MockProxyUserOptions = Partial<MockProxyOptions>;

export interface MockProxyOptions {
  /**
   * Mode determines how mock server handles incoming requests
   * "record" - Server proxy requests to the targetUrl and save responses
   * "replay" - Server read response from file. If there are no matching file, 404 error.
   * "replayOrProxy". Server reads response from file. If there are no matching file, go to targetUrl.
   * "replayOrRecord". Server reads response from file. If there are no matching file, go to targetUrl and record response.
   */
  mode: "record" | "replay" | "replayOrRecord" | "replayOrProxy" | "proxy";

  /**
   * Rewrite target's url path. Object-keys will be used as RegExp to match paths.
   * (from http-proxy-middleware)
   */
  pathRewrite: Record<string, string> | undefined;

  /**
   * Converts proxy response. If used in record mode, converted response will be saved
   */
  convertProxyResponse: (body: Buffer, ctx: Context) => Buffer;
  /**
   * An url where a mock server proxies request.
   * Required for all modes except "replay"
   */
  targetUrl: string;
  /**
   * A base directory for all mocks
   * Required for all modes except "proxy"
   */
  mocksDirectory: string | null | ((path: string) => string);
  recordOptions: {
    /**
     * A postfix for file url depending on working mode
     * You can use different postfixes depending on a scenario or an incoming request (request body, headers, etc)
     */
    getFilenamePostfix?: (ctx: Context) => string;
    /**
     * Determines is mock server can overwrite file in record mode
     * You can also redefine this value is mock file by adding file "overwrite"
     */
    overwrite?: boolean;
  };
}

export interface MockFileContents {
  /**
   * Http status code
   */
  code: number;

  /**
   * An exact recorded url (using just for information)
   */
  requestUrl: string;

  /**
   * Response headers
   */
  headers: OutgoingHttpHeaders;

  /**
   * Determines how body field was encoded in current file
   */
  bodyEncoding: "utf-8" | "base64" | "json";

  /**
   * Response body
   */
  body: string | object;

  overwrite?: boolean;
}
