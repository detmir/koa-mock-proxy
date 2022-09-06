# Recording mocks

There are 2 ways of recording mocks:
 * Using `record` or `replayOrRecord` [modes](./workingModes.md) in optional
 * Using [UI](./ui.md)

## Records format

Currently, `koa-mock-server` records requests without taking care of query params.

For example, recorded mocks from `GET /products?category=A` can be reused for any requests to path `/products` by method `GET`:
 * `GET /products?category=b`
 * `GET /products?limit=10`
 * (but not `GET /products/1`)

This behaviour is intentional. In our practice in many cases mocks with different query params can be reused in tests.
Reusing mocks is often beneficial, because more mocks you have, more difficult to support them (update, understand or delete).

Sometimes reusing mocks is not possible.
In that way it's recommended to rename recorded mocks [using file naming rules](./mocks.md) to
fit your needs better. Another alternative solution is to use [JS mocks](./mocks.md#js-mocks).

## Recording using `record` or `replayOrRecordMode` modes

In these modes mock server record mocks automatically after proxying. By default, existing mocks are not get overwritten.
However, it's possible to overwrite mock by using `record` mode with `recordOptions.overwrite` set to true.

## Recording using UI

It's possible to record requests through UI in any working mode.

To do that:
 * Proxy needed requests to the target server
 * Go to the UI
 * Select mocks you need to record
 * Click button `Record mocks`
