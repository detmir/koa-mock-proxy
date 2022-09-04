# API reference

## Middlewares

All functions here return Koa middleware (`(ctx, next) => Promise`)

### mockProxyMiddleware([options: MockProxyOptions](#mock-proxy-options))

Main middleware, for proxy/mock incoming requests.

Example of usage:

```
const server = new Koa();

server.use(koaMockProxy({
 targetUrl: 'http://my-service.com/api'
}));
```

### mockProxyConfigMiddleware([options: MockProxyOptions](#mock-proxy-options))

Creates default options for next `mockProxyMiddleware` middlewares.

### scenariosMiddleware(Record<ScenarioName, Middleware>)

Makes `Middleware` active only when scenario `ScenarioName` is active.

### controlMiddleware(options: { path?: string })

Middleware registers UI and API by given path.

If path is not passed, default path `/mockproxy` will be applied.

## Mock proxy options

You can pass options in `mockProxyMiddleware` or `mockProxyConfigMiddleware`.

### mode

Possible values: `record | replay | replayOrProxy | proxy`

For more details look [description of working modes](../README.md#Working modes)

### targetUrl

Type: `string`

An absolute base url where a mock server proxies request.

Required for all modes except "replay"

### mocksDirectory

Type: `string`

A base directory for all mocks.
Required for all modes except "proxy"

### convertProxyResponse

Type: `(body: Buffer, ctx: Context) => Buffer`


### pathRewrite

Type: `Record<string, string>`

Rewrite target's url path. Object-keys will be used as RegExp to match paths.
(from more examples look to [http-proxy-middleware docs](https://github.com/chimurai/http-proxy-middleware#pathrewrite-objectfunction))

### recordOptions.getFilenamePostfix

Type: `(ctx: Context) => string`

A postfix for filename depending on working mode.
You can use different postfixes depending on a scenario or an incoming request (request body, headers, etc)

### recordOptions.overwrite

Type: `boolean`

Determines whether is mock server can overwrite file in record mode.
You can also redefine this value is mock file by adding file "overwrite"

### recordOptions.filterHeaders

Type: `(headers: Record<string, stirng | string[]>) => Record<string, stirng | string[]>`

Allows application to control headers that will be written to mock file.

## Functions for managing mock scenarios

### addAvailableScenarios(scenarios: string[])

Adds selected scenarios to the available scenarios list.

### setActiveScenarios(scenarios: string[])

Makes selected scenarios active.

### getScenariosData(key: string) => any

Returns data for current scenario session.

### setScenariosData(key: string, value: string) => void

Sets data for storing in the current scenario session.
