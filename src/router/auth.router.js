const Router = require("koa-router");
const authRouter = new Router();

const { login, sess } = require("../controller/auth.controller");
const {
  loginVerification,
  verifyAuthorization,
} = require("../middleware/auth.middleware");
authRouter.post("/login", loginVerification, login);
authRouter.post("/test", verifyAuthorization, sess);
module.exports = authRouter;
