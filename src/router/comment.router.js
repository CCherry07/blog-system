const Router = require("koa-router");
const {
  createComment,
  commentReply,
  updateComment,
  deleteComment,
  getCommentsList,
} = require("../controller/comment.controller");
const {
  verifyAuthorization,
  permissionControl,
} = require("../middleware/auth.middleware");
const commentRouter = new Router({ prefix: "/comment" });

commentRouter.post("/", verifyAuthorization, createComment);
commentRouter.post("/:commentId/reply", verifyAuthorization, commentReply);
//获取评论列表
commentRouter.get("/", getCommentsList);
commentRouter.patch(
  "/:commentId",
  verifyAuthorization,
  permissionControl,
  updateComment
);
commentRouter.delete(
  "/:commentId",
  verifyAuthorization,
  permissionControl,
  deleteComment
);

module.exports = commentRouter;
