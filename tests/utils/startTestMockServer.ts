import { createTestServer } from "../testserver";
import Koa from "koa";
import { mockProxyMiddleware, MockProxyUserOptions } from "../../src";
import { startApplication } from "./startApplication";

export const startTestMockServer = async (options: MockProxyUserOptions) => {
  const { address: targetServer, stop: stopTestServer } =
    await createTestServer();

  const app = new Koa();

  app.use(
    mockProxyMiddleware({
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
