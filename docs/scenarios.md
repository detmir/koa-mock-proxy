# Mock scenarios

For different tests it's often necessary to have different responses from
the same request URI.

For example, you may want to check what will happen with your UI, if server returns:
 1. Empty products list
 2. Products list with/without need for pagination
 3. 404 Error

To do that, define several mocks for different scenarios. After, in tests, set active scenario to choose desired mock.

Define scenarios possible in two ways.
 1. through [mock file location](./mocks.md#Mock-file-location) (for example, you have several recorded mocks in mocks directory, like `GET_products.empty.json`, `GET_products.404.json`).
 2. through [scenariosMiddleware](./api#scenariosMiddleware)


Setting active scenario possible by 2 ways:
1. By [UI](../README.md#UI)
2. By API that available after applying [controlMiddleware](./api). To set active scenarios, use `PUT /${controlPath}/api/scenarios`.
