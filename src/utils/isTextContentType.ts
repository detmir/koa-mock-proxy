const safeContentTypes = [
  /^text\//,
  /^application\/[a-z.+]*json/,
  /^application\/[a-z.+]*xml/,
  /^application\/javascript/,
  /^application\/svg/,
];

export const isTextContentType = (contentType) => {
  return safeContentTypes.some((regexp) => regexp.test(contentType));
};
