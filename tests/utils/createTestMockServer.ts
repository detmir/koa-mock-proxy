import { createTestServer } from "../testserver";
import Koa from "koa";
import { mockProxy } from "../../src/mockProxy";
import { startApplication } from "./startApplication";
import { MockProxyUserOptions } from "../../src/types";

export const createTestMockServer = async (options: MockProxyUserOptions) => {
  const { address: targetServer, stop: stopTestServer } =
    await createTestServer();

  const app = new Koa();

  app.use(
    mockProxy({
      ...options,
      targetUrl: targetServer,
    })
  );

  const { server, stop: stopProxyServer } = await startApplication(app);

  return {
    server,
    stop: async () => {
      await Promise.all([stopProxyServer(), stopTestServer()]);
    },
  };
};
