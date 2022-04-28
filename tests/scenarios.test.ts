import { startApplication } from "./utils/startApplication";
import Koa from "koa";
import request from "supertest";
import { scenariosMiddleware, setActiveScenarios } from "../src";

const createServerWithMiddlewares = () => {
  const app = new Koa();

  app.use(
    scenariosMiddleware({
      test: (ctx, next) => {
        ctx.body = `${ctx.body ?? ""}testbody`;
        return next();
      },
      test2: (ctx, next) => {
        ctx.body = `${ctx.body ?? ""}test2body`;
        return next();
      },
    })
  );

  return startApplication(app);
};

describe("Test scenarios", () => {
  it("Should apply middleware when given scenario is active", async () => {
    const server = await createServerWithMiddlewares();
    await setActiveScenarios("test");

    await request(server.server).get("/").expect(200, "testbody");

    await server.stop();
  });

  it("Should not apply middleware when no have active scenario", async () => {
    const server = await createServerWithMiddlewares();
    await setActiveScenarios("tests");

    await request(server.server).get("/").expect(404);

    await server.stop();
  });

  it("Should apply multiple middlewares in given order", async () => {
    const server = await createServerWithMiddlewares();
    await setActiveScenarios(["test2", "test"]);

    await request(server.server).get("/").expect(200, "test2bodytestbody");

    await server.stop();
  });
});
