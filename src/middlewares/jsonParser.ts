import koaBody from 'koa-body';

export const jsonParser = () =>
  koaBody({
    text: false,
    multipart: true,
    urlencoded: true,
    parsedMethods: ['POST', 'PUT', 'PATCH', 'SEARCH', 'DELETE'],
  });
