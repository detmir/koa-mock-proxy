module.exports = async (ctx, next) => {
  await next();
  ctx.body = "afterNext";
};
