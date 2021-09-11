const commentService = require("../service/comment.service");
class CommentController {
  async createComment(ctx, next) {
    const { content, momentId } = ctx.request.body;
    const userId = ctx.user.id;
    const res = await commentService.createComment({
      content,
      momentId,
      userId,
    });
    ctx.body = res;
  }
  async commentReply(ctx, next) {
    const { content, momentId } = ctx.request.body;
    const { commentId } = ctx.params;
    const userId = ctx.user.id;
    const res = await commentService.commentReply({
      content,
      momentId,
      userId,
      commentId,
    });
    ctx.body = res;
  }
  async updateComment(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;
    const res = await commentService.updateComment(content, commentId);
    ctx.body = res;
  }
  async deleteComment(ctx, next) {
    const { commentId } = ctx.params;
    const res = await commentService.deleteComment(commentId);
    ctx.body = res;
  }
  async getCommentsList(ctx, next) {
    const { momentId } = ctx.query;
    const res = await commentService.getCommentsListById(momentId);
    ctx.body = res;
  }
}

module.exports = new CommentController();
