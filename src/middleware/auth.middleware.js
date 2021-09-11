const jwt = require("jsonwebtoken");
const errorType = require("../constants/errorType");
const userService = require("../service/user.service");
const authService = require("../service/auth.service");
const md5password = require("../utils/md5");
const { PUBLIC_KEY } = require("../app/config");
const loginVerification = async (ctx, next) => {
  const { name, password } = ctx.request.body;
  if ((!name, !password)) {
    const error = new Error(errorType.Name_Or_Password_Cannot_Be_Empty);
    return ctx.app.emit("error", error, ctx);
  }
  const resForName = await userService.getUserByName(name);
  const user = resForName[0];
  if (!user) {
    const error = new Error(errorType.USER_DOES_NOT_EXIST);
    return ctx.app.emit("error", error, ctx);
  }
  if (md5password(password) !== user.password) {
    const error = new Error(errorType.WRONG_PASSWORD);
    return ctx.app.emit("error", error, ctx);
  }
  ctx.user = user;
  await next();
};
const verifyAuthorization = async (ctx, next) => {
  //获取token
  const authorization = ctx.headers.authorization;
  let token = "";
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZED);
    ctx.app.emit("error", error, ctx);
  } else {
    token = authorization.replace("Bearer ", "");
  }
  //验证token
  try {
    const verification = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = verification;
    console.log("验证通过");
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZED);
    ctx.app.emit("error", error, ctx);
  }
};
const permissionControl = async (ctx, next) => {
  const userId = ctx.user.id;
  const [resourceKey] = Object.keys(ctx.params) || null;
  const resourceId = ctx.params[resourceKey] || ctx.query.momentId;
  const tableName = resourceKey ? resourceKey.replace("Id", "") : "moment";
  const isPermissions = await authService.permissionControl(
    tableName,
    resourceId,
    userId
  );
  if (!isPermissions) {
    const error = new Error(errorType.NO_CONTROL_PERMISSIONS);
    return ctx.app.emit("error", error, ctx);
  }
  await next();
};
module.exports = {
  loginVerification,
  verifyAuthorization,
  permissionControl,
};
