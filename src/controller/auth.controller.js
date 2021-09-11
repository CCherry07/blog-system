const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");
class AuthController {
  async login(ctx, next) {
    const { name, id } = ctx.user;
    //jwt.sign（信息对象，密钥 ， token的生命周期与加密算法）
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 72,
      algorithm: "RS256",
    });
    ctx.body = {
      id,
      name,
      message: `登录成功 , ${name} 欢迎回来 `,
      token,
    };
  }
  async sess(ctx) {
    ctx.body = "登录成功";
  }
}
module.exports = new AuthController();
