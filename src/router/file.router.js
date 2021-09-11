const Router = require("koa-router");
const {
  avatarHandler,
  pictureHandler,
  videoHandler,
  pictureResize,
  musicHandler,
} = require("../middleware/file.middleware");
const {
  saveAvatarInfo,
  savePictureInfo,
  saveVideo,
  saveMusic,
} = require("../controller/file.controller");
const fileRouter = new Router({ prefix: "/upload" });
const {
  verifyAuthorization,
  permissionControl,
} = require("../middleware/auth.middleware");
//需要登录
//保存图像
//保存图像信息
fileRouter.post("/avatar", verifyAuthorization, avatarHandler, saveAvatarInfo);
fileRouter.post(
  "/picture",
  verifyAuthorization,
  permissionControl,
  pictureHandler,
  pictureResize,
  savePictureInfo
);
fileRouter.post(
  "/video",
  verifyAuthorization,
  permissionControl,
  videoHandler,
  saveVideo
);
fileRouter.post(
  "/music",
  verifyAuthorization,
  permissionControl,
  musicHandler,
  saveMusic
);
module.exports = fileRouter;
