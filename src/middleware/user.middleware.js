const errorType = require("../constants/errorType");
const UserService = require("../service/user.service");
const md5password = require("../utils/md5");
const verification = async (ctx, next) => {
  // 验证合法
  let { name, password } = ctx.request.body;
  // 判断用户名或者密码不能为空
  if (!name || !password) {
    const error = new Error(errorType.Name_Or_Password_Cannot_Be_Empty);
    return ctx.app.emit("error", error, ctx);
  }
  if (name) {
    name = name.trim();
  }
  if (password) {
    password = (password + "").trim();
  }
  //查询用户是否存在
  const resForName = await UserService.getUserByName(name);
  if (resForName.length > 0) {
    const error = new Error(errorType.USERNAME_ALREADY_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }
  await next();
};
//对密码的加密
const encryption = async (ctx, next) => {
  let { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);
  await next();
};
module.exports = {
  verification,
  encryption,
};
