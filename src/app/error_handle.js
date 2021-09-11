const errorType = require("../constants/errorType");
const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errorType.Name_Or_Password_Cannot_Be_Empty:
      status = 400;
      message = "账号和密码不能为空";
      break;
    case errorType.USERNAME_ALREADY_EXISTS:
      status = 400;
      message = "用户民已存在";
      break;
    case errorType.USER_DOES_NOT_EXIST:
      status = 400;
      message = "用户不存在";
      break;
    case errorType.WRONG_PASSWORD:
      status = 400;
      message = "用户密码错误";
      break;
    case errorType.UNAUTHORIZED:
      status = 401;
      message = "用户未授权";
      break;
    case errorType.NO_CONTROL_PERMISSIONS:
      status = 401;
      message = "您没有控制权限";
      break;
    default:
      status = 404;
      message = "Not Found";
  }
  ctx.status = status;
  ctx.body = message;
};

module.exports = errorHandler;
