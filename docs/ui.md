# UI

![UI](./ui.png)

In UI you can:
* Explore requests log and response source (mock vs proxy)
* Set active scenarios
* Record selected requests to mock file

For using UI you need to apply [controlMiddleware](/docs/api):

``
server.use(controlMiddleware({ path: '/mockproxy' }));
``

After applying, UI will be available at the path `/mockproxy`.
