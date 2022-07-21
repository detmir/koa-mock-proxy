export const log  = (type: 'info' | 'debug', message: string) => {
  if (process.env.DEBUG_PROXY && process.env.DEBUG_PROXY!=='false') {
    console.log(message);
  }
}
