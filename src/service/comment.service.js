const connection = require("../app/database");
class CommentService {
  async createComment({ content, momentId, userId }) {
    const statement = `
    INSERT INTO comment(content , moment_id ,user_id) VALUES (?,?,?);
    `;
    try {
      const [res] = await connection
        .promise()
        .execute(statement, [content, momentId, userId]);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async commentReply({ content, momentId, userId, commentId }) {
    const statement = `
    INSERT INTO comment(content , moment_id ,user_id , comment_id) VALUES (?,?,?,?);
    `;
    try {
      const [res] = await connection
        .promise()
        .execute(statement, [content, momentId, userId, commentId]);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async updateComment(content, commentId) {
    const statement = `
    UPDATE comment SET content = ? WHERE id = ?;
    `;
    try {
      const [res] = await connection
        .promise()
        .execute(statement, [content, commentId]);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async deleteComment(commentId) {
    const statement = `
    DELETE FROM comment WHERE id = ?;
    `;
    try {
      const [res] = await connection.promise().execute(statement, [commentId]);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async getCommentsListById(momentId) {
    const statement = `
    SELECT  comment.id , comment.content , comment.createAt , comment.updateTime ,
    comment.comment_id ,comment.user_id ,
    JSON_OBJECT('id',users.id , 'name' ,users.name) user FROM comment
    LEFT JOIN users ON comment.user_id = users.id
    WHERE moment_id = ?;
    `;
    const [res] = await connection.promise().execute(statement, [momentId]);
    return res;
  }
}
module.exports = new CommentService();
