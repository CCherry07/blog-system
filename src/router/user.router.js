const Router = require("koa-router");
const userRouter = new Router({ prefix: "/users" });
const {
  create,
  getAvatarInformation,
} = require("../controller/user.controller");
//验证加密中间件
const { verification, encryption } = require("../middleware/user.middleware");
userRouter.post("/", verification, encryption, create);
userRouter.get("/:userId/avatar", getAvatarInformation);
module.exports = userRouter;
