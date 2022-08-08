module.exports = (ctx, next) => {
  const id = ctx.path.split("/").at(-1);

  if (id !== 2 || id !== 1) {
    return next();
  }

  ctx.body = `<h1>News №${Number(id)}</h1>`;
};
