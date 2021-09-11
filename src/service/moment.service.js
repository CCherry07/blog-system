const connection = require("../app/database");
const { APP_HOST, APP_PORT } = require("../app/config");
const imagePath = `${APP_HOST}:${APP_PORT}/moment/images/`;
const videoPath = `${APP_HOST}:${APP_PORT}/moment/video/`;
const audioPath = `${APP_HOST}:${APP_PORT}/moment/music/`;
class MomentService {
  //添加动态
  async releaseDynamics(userId, content) {
    const statement = `INSERT INTO moment(content, user_id) VALUES (?,?);`;
    const res = await connection
      .promise()
      .execute(statement, [content, userId]);
    return res;
  }
  //根据动态id获取动态（单条）
  async getDynamicById(id) {
    const statement = `
    SELECT 
    moment.id id ,moment.content content ,moment.createAt createAt ,moment.updateTime updateTime,
    JSON_OBJECT('id', users.id,'name' ,users.name ,'avatar_Url' ,users.avatar_url) user ,

    (SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id ) commentCount,
    (SELECT COUNT(*) FROM maplikes WHERE maplikes.moment_id = moment.id) likeCount,
    (SELECT IF(COUNT(comment.id),JSON_ARRAYAGG(
    JSON_OBJECT('id' , comment.id,'content' , comment.content,'commentId',comment.id,
    'comment_id',comment.comment_id,'createTime',comment.createAt , 'updateTime', comment.updateTime,
    'user',JSON_OBJECT('id' , users.id ,'name',users.name ,'avatar_Url' ,users.avatar_url)
    )),NULL) FROM comment LEFT JOIN users ON comment.user_id = users.id 
    WHERE comment.moment_id = moment.id) comments,

    IF(COUNT(label.id),JSON_ARRAYAGG(JSON_OBJECT('id',label.id , 'name',label.name)) ,NULL)labels,
    (SELECT JSON_ARRAYAGG(CONCAT('${imagePath}',dynamicPicture.filename)) FROM dynamicPicture WHERE dynamicPicture.moment_id = moment.id)images,
    (SELECT JSON_OBJECT('name',music.filename , 'audioUrl', CONCAT('${audioPath}',music.filename)) FROM music WHERE music.moment_id = moment.id) audio,
    (SELECT CONCAT('${imagePath}',video.filename) FROM video WHERE video.moment_id = moment.id) videoUrl
    FROM moment LEFT JOIN users ON moment.user_id = users.id
    LEFT JOIN maplabel ON maplabel.moment_id = moment.id
    LEFT JOIN label ON label.id = maplabel.label_id
    WHERE moment.id = ?
    GROUP BY moment.id;`;
    const [res] = await connection.promise().execute(statement, [id]);
    return res;
  }
  //根据offset size 获取动态列表
  async getMultipleDynamicsList(offset, size) {
    const statement = `
    SELECT 
    moment.id id ,moment.content content ,moment.createAt createAt ,moment.updateTime updateTime,
    JSON_OBJECT('id', users.id,'name' ,users.name ,'avatar_Url' ,users.avatar_url) author,
    (SELECT COUNT(*) FROM comment WHERE comment.moment_id = moment.id) commentCount,
    (SELECT COUNT(*) FROM mapLabel WHERE mapLabel.moment_id = moment.id) labelCount,
    (SELECT COUNT(*) FROM maplikes WHERE maplikes.moment_id = moment.id) likeCount,
    (SELECT JSON_ARRAYAGG(CONCAT('${videoPath}',dynamicPicture.filename)) FROM dynamicPicture WHERE dynamicPicture.moment_id = moment.id)images,
    (SELECT JSON_OBJECT('name',music.filename , 'audioUrl', CONCAT('${audioPath}',music.filename)) FROM music WHERE music.moment_id = moment.id) audio,
    (SELECT CONCAT('${videoPath}',video.filename) FROM video WHERE video.moment_id = moment.id) videoUrl
    FROM moment LEFT JOIN users ON moment.user_id = users.id 
    LIMIT ? ,?;
    `;
    try {
      const [res] = await connection
        .promise()
        .execute(statement, [offset, size]);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  //更新动态
  async setDynamic(content, momentId) {
    const statement = `
    UPDATE moment SET content = ? WHERE id=?;
    `;
    const [res] = await connection
      .promise()
      .execute(statement, [content, momentId]);
    return res;
  }
  //删除动态
  async deleteDynamicById(momentId) {
    const statement = `
    DELETE FROM moment WHERE id = ?;
    `;
    try {
      const [res] = await connection.promise().execute(statement, [momentId]);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async hasLabel(momentId, labelId) {
    const statement = `
    SELECT * FROM mapLabel WHERE mapLabel.label_id = ? AND mapLabel.moment_id = ? ;
    `;

    const [res] = await connection
      .promise()
      .execute(statement, [labelId, momentId]);
    return res;
  }
  async setLabels(momentId, labelId) {
    const statement = `
    INSERT INTO mapLabel(label_id , moment_id) VALUES(?,?);
    `;
    const [res] = await connection
      .promise()
      .execute(statement, [labelId, momentId]);
    return res;
  }

  async createLikeAndCollect(momentId, userId, type) {
    let IStatement, DStatement;
    if (type === "Like") {
      IStatement = `
          INSERT INTO maplikes(moment_id , user_id) VALUES (? ,?);
    `;
      DStatement = `
          DELETE FROM maplikes WHERE moment_id = ? AND user_id = ?;
      `;
    } else if (type === "Collect") {
      IStatement = `
          INSERT INTO mapCollect(moment_id , user_id) VALUES (? ,?);
    `;
      DStatement = `
          DELETE FROM mapCollect WHERE moment_id = ? AND user_id = ?;
      `;
    }
    try {
      const [res] = await connection
        .promise()
        .execute(IStatement, [momentId, userId]);
      return res;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const [res] = await connection
          .promise()
          .execute(DStatement, [momentId, userId]);
        return `已取消 ${type}`;
      }
    }
  }
}
module.exports = new MomentService();
