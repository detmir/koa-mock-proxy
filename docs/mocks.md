# Mocks format and location

Mocks are stored in file system in `mocksDirectory`. The exact location depends on http method, uri path,
scenario and query location.

## Mock file location

File path location:

`[path]/[httpMethod]_[pathSlug][_posfix]?[.scenario]*[.paramName=paramValue]*.[json|js]`

(`*` means this filename part is optional and can be multiple, `?` means this filename part is optional)

where:
* `path` - HTTP request path (except the last path fragment)
* `httpMethod` - HTTP method (GET/POST, etc...)
* `pathSlug` - the last part of HTTP path fragment (for example, for path /products/list `pathSlug` will be `list`).
* `posfix` (optional) - string that returns `recordOptions.getFilenamePostfix` from middleware options
* `scenario` (optional) - one of current active scenarios. It's possible to set multiple scenarios in filename (for example, `GET_path.scenario1.scenario2.json`)
*  `paramName=paramValue` (optional) - query params for HTTP requests. It's possible specify multiple query parameters (`GET_path.param1=value1.param2=value2.json`)

Some rules to mention:
* Query parameters are optional. If parameter is not specified, it can be any value.
* If you specify query params, it doesn't mean that matched request can not have other query params.
* If there is no last part of path (path is `/`), `pathSlug` is `__root__`.
* If scenarios are not specified, it can be any scenario.
* Prohibited symbols for filenames (for Windows, Linux or macOS) will be replaced to `_` (underscore)

If multiple files match http request, the system choose the most specific file.
It will be determined by the biggest weight of the filename:
* `1 scenario` increases weight by `100`
* `1 query parameter` increases weight by `10`
* `.js extension` increases weight by `1`

## index.js file

Also, if index.js exists in target directory, default middleware from there will be called first.

If middleware from index.js will calls `next()` function, the library will look for another suitable file that can be matched with URL.

## Example

For example, we have the following file structure:

```
mocks/
├─ products/
│  ├─ GET_1.js
│  ├─ index.js
├─ GET_products.json
├─ GET_products_postfix.json
├─ GET_products.popular=1.json
├─ GET_products.popular=1.sort=asc.json
├─ GET_products.empty.json
├─ GET_products.empty.popular=0.json
├─ GET___root__.json
```

Then, HTTP requests match the following files:

* `GET /` => `/GET___root__.json` (special case for empty path)
* `GET /products/1` => `/products/index.js`, `/products/GET_1.json` (first, it runs index.js. If middleware in index.js calls `next`, `/products/GET_1.json` will be included)
* `GET /products?a=b` => `/GET_products.json` (since there are no files with exact query parameters)
* `GET /products?popular=1` => `/GET_products.popular=1.json`
* `GET /products?popular=1&sort=desc` => `/GET_products.popular=1.json` (since this file is the most specific)
* `GET /products?popular=1&sort=asc` => `/GET_products.popular=1.sort=asc.json`

If scenario `empty` is active:

* `GET /products/1` => `/products/GET_1.json`
* `GET /products?popular=1` => `/GET_products.empty.json` (because `scenario` in filename has bigger weight than query parameter)
* `GET /products?popular=0` => `/GET_products.empty.popular=0.json`

If `getFilenamePostfix` is applied:

```
mockProxyMiddleware({
  recordOptions: {
    getFilenamePostfix: () => 'postfix'
  }
})
```

* `GET /products` => `/GET_products_postfix.json`


## JS mocks

If mock file has `js` extension, it must return middleware function `(ctx, next) => Promise`.

If middleware calls `next`, the library will look for a more specific mock file.

Example of index.js file:

```js
module.export = (ctx, next) => {
  const { id } = ctx.query;
  if (!id) {
    ctx.status = 400;
    ctx.body = { message: 'Id query param is required!' };
    return;
  }

  return next();
}
```

## JSON mocks

JSON mocks have the following fields:

* `code` (optional) - http status code. 200 by default.
* `headers` (optional) - http response headers (an object with `headerName` as a key, `headerValue` as a value)
* `body` (optional) - http response
* `bodyEncoding` (optional) - encoding of body field (`json` by default). Possible values:
  * `json` - `body` will be stringified in JSON
  * `utf-8` - string in UTF-8
  * `base64` - binary data encoded in base64
