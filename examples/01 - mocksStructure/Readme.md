# Example of mocks structure

This example shows mocks in different formats and locations.

Here are the list of files with explanations:

 * [./index.ts](./index.ts]) - base configuration (mock-server in `replay` mode)
 * [./mocks/GET___root__.json](./mocks/GET___root__.json) - mock responds to request `GET /`
 * [./mocks/GET_news.latest=true.json](./mocks/GET_news.latest=true.json) - mock responds to request `GET /news?latest=true`
 * [./mocks/GET_about.json](./mocks/GET_about.js) - mock responds to request `GET /about`
 * [./mocks/news/index.js](./news/index.js) - file listens for all requests `/news/:id`, but forward further if `(id!=1 || id!=2)`
 * [./mocks/news/GET_3.js](./news/GET_3.js) - mock responds to request `GET /news/3`

Some mocks in `js`, some in `json`, both formats are supported.

## Running

1. `npx ts-node index.ts`
2. Visit http://localhost:9002/ in browser
