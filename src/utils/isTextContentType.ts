const safeContentTypes = [
  /^text\//,
  /^application\/[a-z.+]*json/,
  /^application\/[a-z.+]*xml/,
  /^application\/javascript/,
  /^application\/svg/,
];

/**
 * Return is contentType can be safely stored as a string
 * @param contentType
 */
export const isTextContentType = (contentType: string) => {
  return safeContentTypes.some((regexp) => regexp.test(contentType));
};
