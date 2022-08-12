module.exports = (ctx, next) => {
  if (ctx.query.noNext) {
    ctx.body = "noNext";
    return;
  }

  return next();
};
