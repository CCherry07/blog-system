const Router = require("koa-router");
const momentRouter = new Router({ prefix: "/moment" });
const {
  createMoment,
  getDynamic,
  getMultipleDynamics,
  updateDynamic,
  deleteDynamic,
  setLabels,
  getImage,
  getVideo,
  getMusic,
  momentLike,
  momentCollect,
  momentReward,
  updateMusic,
} = require("../controller/moment.controller");
//身份验证 权限控制
const {
  verifyAuthorization,
  permissionControl,
} = require("../middleware/auth.middleware");
const { whetherTheLabelExists } = require("../middleware/label.middleware");
const {
  customizeImage,
  musicHandler,
} = require("../middleware/file.middleware");
//发布动态
momentRouter.post("/", verifyAuthorization, createMoment);
//获取动态
momentRouter.get("/:momentId", getDynamic);
//获取动态列表
momentRouter.get("/", getMultipleDynamics);
//修改动态
momentRouter.patch(
  "/:momentId",
  verifyAuthorization,
  permissionControl,
  updateDynamic
);
//删除动态
momentRouter.delete(
  "/:momentId",
  verifyAuthorization,
  permissionControl,
  deleteDynamic
);
//给动态添加标签
momentRouter.post(
  "/:momentId/labels",
  verifyAuthorization,
  permissionControl,
  whetherTheLabelExists,
  setLabels
);

momentRouter.get("/images/:filename", customizeImage, getImage);
momentRouter.get("/video/:filename", getVideo);
momentRouter.get("/music/:filename", getMusic);

momentRouter.patch(
  "/:momentId/updateMusic",
  verifyAuthorization,
  permissionControl,
  musicHandler,
  updateMusic
);
momentRouter.post("/:momentId/like", verifyAuthorization, momentLike);
momentRouter.post("/:momentId/collect", verifyAuthorization, momentCollect);
momentRouter.post("/:momentId/reward", verifyAuthorization, momentReward);
module.exports = momentRouter;
