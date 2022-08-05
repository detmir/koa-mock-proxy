module.exports = (ctx, next) => {
  if (ctx.path === "/indexfile/indexcontent") {
    ctx.body = "indexcontent";
    return;
  }

  return next();
};
