import { MemoryLogStorage } from "../logMiddleware";
import { createMockContext } from "@shopify/jest-koa-mocks";

describe("MemoryLogStorage", () => {
  it("Should put new items", () => {
    const ctx = createMockContext({
      url: "http://test.com/test?1=a",
    });
    const storage = new MemoryLogStorage();
    storage.putLogItem(ctx, 0);

    expect(storage.getItems().length).toBe(1);
    expect(storage.getItems()[0]).toMatchObject({
      url: ctx.url,
      method: "GET",
    });
  });

  it("Should shrink after increase limit", () => {
    const fakeMocks = [1, 2, 3, 4].map((number) =>
      createMockContext({ url: `url${number}` })
    );

    const limit = 3;

    const storage = new MemoryLogStorage(limit);
    for (let i = 0; i < limit; i++) {
      storage.putLogItem(fakeMocks[i], 0);
    }

    expect(storage.getItems().length).toEqual(limit);

    storage.putLogItem(fakeMocks[limit], 0);

    expect(storage.getItems().length).toEqual(limit);
    expect(storage.getItems().map((item) => item.url)).toMatchObject(
      fakeMocks.slice(1).map((ctx) => ctx.url)
    );
  });
});
